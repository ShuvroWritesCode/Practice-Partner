import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { auth, db } from "../utlis/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const conversationsRef = collection(
          db,
          "users",
          user.uid,
          "conversations"
        );
        const q = query(conversationsRef, orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);

        const sessionsData = [];
        for (const doc of querySnapshot.docs) {
          // Get the first message of each conversation
          const messagesRef = collection(
            db,
            "users",
            user.uid,
            "conversations",
            doc.id,
            "messages"
          );
          const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
          const messagesSnapshot = await getDocs(messagesQuery);

          const firstMessage = messagesSnapshot.docs[0]?.data();
          if (firstMessage && firstMessage.role === "user") {
            sessionsData.push({
              id: doc.id,
              updatedAt: doc.data().updatedAt?.toDate(),
              firstMessage: firstMessage.content,
            });
          }
        }

        setSessions(sessionsData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  const handleSessionClick = (sessionId) => {
    navigate(`/chat?session=${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[calc(100vh-6rem)]">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] mt-10 md:w-[90%] max-md:w-full">
      <div className="md:mx-12 max-md:mx-4 flex flex-col h-full">
        <h2 className="text-3xl mb-6 text-white">Chat History</h2>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className="bg-secondary rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-70">
                  {session.updatedAt?.toLocaleString()}
                </span>
              </div>
              <p className="text-lg line-clamp-2">{session.firstMessage}</p>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-white py-8">
              No chat history found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
