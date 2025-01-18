import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { toast } from "react-toastify";
import { auth, db } from "../utlis/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getGeminiModel } from "../utils/gemini";

const Chat = ({ setIsSubscribed }) => {
  const containerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Get user document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setIsSubscribed(userData?.isSubscribed || false);

        // Initialize chat session
        let sessionId = new URLSearchParams(location.search).get("session");
        if (!sessionId) {
          // Create a new chat session
          const sessionsRef = collection(
            db,
            "users",
            user.uid,
            "conversations"
          );
          const newSessionRef = await addDoc(sessionsRef, {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          sessionId = newSessionRef.id;
          navigate(`/chat?session=${sessionId}`);
        }
        setCurrentSessionId(sessionId);

        // Load messages for current session
        const messagesRef = collection(
          db,
          "users",
          user.uid,
          "conversations",
          sessionId,
          "messages"
        );
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        const loadedMessages = querySnapshot.docs.map((doc) => ({
          role: doc.data().role,
          content: doc.data().content,
        }));
        setMessages(loadedMessages);

        // Initialize Gemini chat with history
        const model = getGeminiModel();
        const newChat = model.startChat({
          history: loadedMessages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });
        setChat(newChat);

        setPageLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load chat history");
        setPageLoading(false);
      }
    };

    loadUserData();
  }, [navigate, location.search, setIsSubscribed]);

  const handleSendMessage = async () => {
    if (!inputMessage || !inputMessage.trim()) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please log in to continue");
        return;
      }

      if (!chat) {
        // Reinitialize chat if it's not available
        const model = getGeminiModel();
        const newChat = model.startChat({
          history: messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            maxOutputTokens: 1000,
          },
        });
        setChat(newChat);
      }

      // Get user document to check prompts
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Check if user has available prompts
      if (!userData.isSubscribed && userData.freePrompts <= 0) {
        toast.error(
          "You've used all your free prompts. Please subscribe to continue."
        );
        navigate("/plan");
        return;
      }

      const trimmedMessage = inputMessage.trim();
      setLoading(true);
      // Add user's message to chat immediately
      const userMessage = { role: "user", content: trimmedMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Clear input after sending
      setInputMessage("");

      // Store user message in Firestore
      const messagesRef = collection(
        db,
        "users",
        user.uid,
        "conversations",
        currentSessionId,
        "messages"
      );
      await addDoc(messagesRef, {
        ...userMessage,
        timestamp: serverTimestamp(),
      });

      // Update conversation's updatedAt timestamp
      const sessionRef = doc(
        db,
        "users",
        user.uid,
        "conversations",
        currentSessionId
      );
      await updateDoc(sessionRef, {
        updatedAt: serverTimestamp(),
      });

      // Get response from Gemini API
      try {
        if (!chat) {
          throw new Error("Chat not initialized");
        }

        const result = await chat.sendMessage(trimmedMessage);
        if (!result || !result.response) {
          throw new Error("No response from AI");
        }

        // Get the response text from the first candidate
        const responseText =
          result.response.candidates[0].content.parts[0].text;
        if (!responseText) {
          throw new Error("Empty response from AI");
        }

        // Add AI's response to chat
        const aiMessage = { role: "assistant", content: responseText };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // Store AI response in Firestore
        await addDoc(messagesRef, {
          ...aiMessage,
          timestamp: serverTimestamp(),
        });

        // Update conversation's updatedAt timestamp again after AI response
        await updateDoc(sessionRef, {
          updatedAt: serverTimestamp(),
        });

        // If user is not subscribed, decrement free prompts
        if (!userData.isSubscribed) {
          await updateDoc(userRef, {
            freePrompts: userData.freePrompts - 1,
          });

          // Show warning if prompts are running low
          if (userData.freePrompts <= 5) {
            toast.warning(
              `You have ${
                userData.freePrompts - 1
              } free prompts remaining. Subscribe to get unlimited access.`,
              {
                onClick: () => navigate("/plan"),
              }
            );
          }
        }
      } catch (aiError) {
        console.error("AI Error:", aiError);
        toast.error("Failed to get AI response. Please try again.");
        // Remove the user's message from the UI if AI fails
        setMessages((prevMessages) => prevMessages.slice(0, -1));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    containerRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (pageLoading) {
    return (
      <div className="bg-primary-container w-full flex justify-center items-center h-svh">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-10 md:w-[90%] max-md:w-full">
      <div className="flex flex-col md:mx-12 max-md:mx-1 rounded-lg overflow-hidden">
        <div className="">
          <div
            className="h-[550px] 2xl:h-[650px] overflow-y-auto bg-on-primary-container"
            ref={containerRef}
          >
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex items-center px-4 py-2 ${
                    message.role === "user"
                      ? "bg-on-primary-container"
                      : "bg-secondary"
                  }`}
                >
                  <img
                    src={
                      message.role === "user" ? "/person_2.png" : "/logo.png"
                    }
                    alt={message.role === "user" ? "User Logo" : "AI Logo"}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="bg-transparent text-white p-2">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center px-4 py-2 bg-secondary">
                <img
                  src="/logo.png"
                  alt="AI Logo"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="flex space-x-2 p-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1 mt-4 md:mx-12 sm:mx-8 bg-white border border-primary rounded-lg">
        <input
          type="text"
          placeholder="Ask Something"
          value={inputMessage}
          disabled={loading}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow px-4 py-3 bg-transparent border-none focus:outline-none text-gray-700 w-[80%] placeholder-black"
        />
        <button
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors duration-300"
          disabled={loading}
          onClick={handleSendMessage}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 border-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0117.709 7H20c0 6.627-5.373 12-12 12v-3.291z"
              ></path>
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
