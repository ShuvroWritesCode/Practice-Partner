import React, { useEffect, useState } from "react";
import { db, auth } from "../utlis/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  collectionGroup,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteUser, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { PropagateLoader } from "react-spinners";
import { toast } from "react-toastify";

function UserManagement() {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const users = [];
      let active = 0;
      let inactive = 0;

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const user = {
          id: doc.id,
          mail: userData.email,
          startDate: userData.isSubscribed
            ? userData.startDate
              ? new Date(userData.startDate.seconds * 1000).toLocaleDateString()
              : ""
            : "",
          expirationDate: userData.isSubscribed
            ? userData.endDate
              ? new Date(userData.endDate.seconds * 1000).toLocaleDateString()
              : ""
            : "",
          subscriptionTerm: userData.isSubscribed
            ? userData.subscriptionTerm || "Premium"
            : "Not Subscribed",
          paymentStatus: userData.isSubscribed ? "Active" : "Inactive",
        };
        users.push(user);

        if (userData.isSubscribed) {
          active++;
        } else {
          inactive++;
        }
      });

      setUserInfo(users);
      setActiveUsers(active);
      setInactiveUsers(inactive);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspendUser = async (userId, userEmail) => {
    try {
      // Delete all conversations
      const conversationsRef = collection(db, "users", userId, "conversations");
      const conversationsSnapshot = await getDocs(conversationsRef);

      const batch = writeBatch(db);

      // Delete each conversation and its messages
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesRef = collection(
          db,
          "users",
          userId,
          "conversations",
          conversationDoc.id,
          "messages"
        );
        const messagesSnapshot = await getDocs(messagesRef);

        // Delete all messages in the conversation
        messagesSnapshot.docs.forEach((messageDoc) => {
          batch.delete(messageDoc.ref);
        });

        // Delete the conversation document
        batch.delete(conversationDoc.ref);
      }

      // Delete user document from Firestore
      const userRef = doc(db, "users", userId);
      batch.delete(userRef);

      // Commit the batch
      await batch.commit();

      // Update UI
      setUserInfo((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      toast.success("User data deleted successfully");
      toast.info(
        "Please delete the user from Firebase Authentication manually in the Firebase Console",
        {
          autoClose: false,
          closeOnClick: false,
        }
      );

      // Update counters
      const wasActive =
        userInfo.find((user) => user.id === userId)?.paymentStatus === "Active";
      if (wasActive) {
        setActiveUsers((prev) => prev - 1);
      } else {
        setInactiveUsers((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error suspending user:", error);
      toast.error("Failed to delete user data");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-6rem)] w-full">
        <PropagateLoader color="#006590" loading={true} size={15} />
      </div>
    );
  }

  return (
    <main className="flex flex-col self-stretch m-4 p-4 w-[90%] max-md:w-[98%] text-2xl leading-7 whitespace-nowrap rounded-xl bg-secondary text-slate-50 h-[calc(100vh-8rem)]">
      <header className="flex gap-2.5 self-start text-slate-900">
        <StatisticBox label="Active Users" value={activeUsers} />
        <StatisticBox label="Inactive Users" value={inactiveUsers} />
      </header>
      <section className="flex flex-col h-full overflow-hidden">
        <h2 className="mt-4 max-md:max-w-full">Users</h2>
        <div className="overflow-y-auto flex-1 mt-2">
          <UserTable users={userInfo} onSuspend={handleSuspendUser} />
        </div>
      </section>
    </main>
  );
}

function StatisticBox({ label, value }) {
  return (
    <div className="flex flex-col flex-1 justify-center p-2 bg-primary-container rounded-xl">
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}

function UserTable({ users, onSuspend }) {
  return (
    <div className="text-base font-medium leading-6 text-center max-md:flex-wrap max-md:max-w-full">
      <div className="flex gap-0 sticky top-0 bg-secondary z-10">
        <UserTableColumn columnTitle="Email" />
        <UserTableColumn columnTitle="Start Date" />
        <UserTableColumn columnTitle="Expiration Date" />
        <UserTableColumn columnTitle="Subscription Term" />
        <UserTableColumn columnTitle="Payment Status" />
        <UserTableColumn columnTitle="Action" />
      </div>
      <div className="mt-2">
        {users.map((user, index) => (
          <div key={index} className="flex gap-0">
            <UserTableDataColumn content={user.mail} />
            <UserTableDataColumn content={user.startDate} />
            <UserTableDataColumn content={user.expirationDate} />
            <UserTableDataColumn
              content={user.subscriptionTerm}
              isStatus={true}
              isActive={user.subscriptionTerm !== "Not Subscribed"}
            />
            <UserTableDataColumn
              content={user.paymentStatus}
              isStatus={true}
              isActive={user.paymentStatus === "Active"}
            />
            <ActionColumn onSuspend={() => onSuspend(user.id, user.mail)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UserTableColumn({ columnTitle }) {
  return (
    <div className="flex flex-col flex-1">
      <div className="py-2">{columnTitle}</div>
    </div>
  );
}

function UserTableDataColumn({ content, isStatus = false, isActive = false }) {
  const statusClasses = isStatus
    ? isActive
      ? "bg-green-500/20 text-green-500"
      : "bg-red-500/20 text-red-500"
    : "";

  return (
    <div className="flex flex-col flex-1">
      <div
        className={`flex items-center justify-center h-10 border border-solid border-slate-200 ${statusClasses}`}
      >
        {content}
      </div>
    </div>
  );
}

function ActionColumn({ onSuspend }) {
  return (
    <div className="flex flex-col flex-1 text-slate-900">
      <div className="flex gap-1 justify-between px-1 py-2">
        <button className="grow justify-center bg-primary-container rounded-xl">
          Edit
        </button>
        <button
          onClick={onSuspend}
          className="grow justify-center bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 transition-colors"
        >
          Suspend
        </button>
      </div>
    </div>
  );
}

export default UserManagement;
