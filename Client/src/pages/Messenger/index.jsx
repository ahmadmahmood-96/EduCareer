import React, { useState, useEffect, useRef } from "react";
import { MdAccountCircle } from "react-icons/md";
import axios from "axios";
import { io } from "socket.io-client";
import logo from "../../images/logo.png";

function Messenger() {
  const [userInfo, setUserInfo] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [Messages, setMessages] = useState([]);
  const [write, setWrite] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false);
  useEffect(() => {
    console.log("Updated conversation:", conversation);
    console.log("Type of conversation:", typeof conversation);
  }, [conversation]);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch user info
    const userToken = localStorage.getItem("token");
    axios
      .get(`http://localhost:8080/api/user/${userToken}/user-details`)
      .then((response) => {
        console.log(response.data);
        const UserId = userToken;
        // const firstname = response.data.firstName;
        const fullName = `${response.data.firstName} ${response.data.lastName}`;
        setUserInfo({ ...response.data, fullName });
        fetchConversations(UserId);
        fetchUsers(UserId);
      })
      .catch((error) => {
        console.error("Error fetching info:", error);
      });
  }, []);

  useEffect(() => {
    // Join Socket.IO room based on selected user
    const userToken = localStorage.getItem("token");
    if (socket && selectedUser && userInfo) {
      socket.emit("addUser", {
        senderId: userToken,
        receiverId: selectedUser.id,
      });
    }
  }, [socket, selectedUser, userInfo]);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    // Handle incoming messages from Socket.IO
    if (socket) {
      socket.on("getUsers", (users) => {
        console.log("Active users:", users);
      });
      socket.on("getMessage", (data) => {
        console.log("Received message:", data.conversationId);
        setMessages((prevMessages) => [...prevMessages, data]);

        // Check if the message was sent by the current user

        // Display the message accordingly based on whether it was sent by the current user or not
      });
    }

    // Clean up Socket.IO event listener on component unmount
    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket, selectedUser]);
  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);

  const fetchConversations = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/conversation/${userId}`
      );
      const conversations = response.data;

      console.log("Fetched conversations:", conversations);

      setConversation(conversations);

      console.log("State after setting conversation:", conversation);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchUsers = async (userId) => {
  //  const userId=  localStorage.getItem("token")
    
    // Fetch users
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      const userData = response.data;
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const sendMessage = async () => {
    // Send message
    const userToken = localStorage.getItem("token");
    console.log(selectedUser.conversationId);

    socket.emit("sendMessage", {
      conversationId: selectedUser.conversationId,
      senderId: userToken,
      message: write,
      receiverId: selectedUser?.id,
    });

    try {
      const Token = localStorage.getItem("token");
      console.log("Iddddddddd", Token);
      const response = await fetch(`http://localhost:8080/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          conversationId: selectedUser.conversationId || "new",
          senderId: Token,
          Message: write,
          receiverId: selectedUser?.id,
        }),
      });
      console.log(selectedUser.conversationId);

      const data = await response.json();
      if (response.ok) {
        console.log("Message sent successfully");
        console.log("receiverrr", receiverId);
        setWrite("");
      } else {
        console.error("Error sending message:", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserClick = async (user) => {
    // Handle user selection
    setSelectedUser(user);
    console.log(selectedUser);
    await fetchMessages(user.conversationId, user); // Pass the selected user object here
  };

  const fetchMessages = async (conversationId, user) => {
    try {
      const userToken = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/message/${conversationId}?senderId=${userToken}&&receiverId=${user.id}`
      );
      const messageData = response.data;

      console.log("Hi", messageData);

      // Format the message data and set the Messages state
      const formattedMessages = messageData.map((message) => ({
        sender: message.senderId,
       
        // receiver: message.receiverId,
        message: message.Message,
      }
      
      )
      );

       console.log("Message", Messages);
      setMessages(formattedMessages);
      console.log("Message", Messages);
      console.log("senderId", message.senderId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // const fetchMessages = async (conversationId, users) => {
  //   // Fetch messages for selected conversation
  //   try {
  //     const userToken = localStorage.getItem("token");
  //     const response = await axios.get(
  //       `http://localhost:8080/api/message/${conversationId}?senderId=${userToken}&&receiverId=${users.id}`
  //     );
  //     const messageData = response.data;
  //     console.log(messageData.Message);
  //     setMessages({ messages: messageData, receiver: users, conversationId });
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  return (
    <>
      <div className="w-screen flex bg-Solitude">
        <div className="w-[25%] bg-solitude overflow-scroll h-screen">
          <div className="flex justify-center items-center shadow-md my-6">
            <MdAccountCircle size={50} />
            <div className="ml-8 my-4">
              {/* // <h3 className="text-2xl">{userInfo.firstname}</h3> */}
              <p className="text-lg text-gray">My Account</p>
            </div>
          </div>
          <div className="ml-10 mt-10">
            <div className="text-Teal text-lg">Messages</div>
            {/* <div
              className="flex items-center py-4 border-b border-b-gray cursor-pointer"
              key={conversation.conversationId}
              onClick={() => {
                setSelectedUser({
                  id: conversation.user.receiverId,
                  firstname: conversation.user.firstname,
                  email: conversation.user.email,
                  conversationId: conversation.conversationId,
                });

              
              }}
            ></div> */}
            <div>
              {conversation.length > 0 ? (
                conversation.map((conversation) => {
                  return (
                    // Inside the map function for rendering conversations
                    <div
                      className="flex items-center py-4 border-b border-b-gray cursor-pointer"
                      key={conversation.conversationId}
                      onClick={() =>
                        handleUserClick({
                          id: conversation.user.receiverId,
                          firstname: conversation.user.firstname,
                          email: conversation.user.email,
                          conversationId: conversation.conversationId,
                        })
                      }
                    >
                      <div className="flex items-center">
                        <MdAccountCircle size={50} />
                        <div className="ml-8 my-4">
                          <h3 className="text-lg font-semibold">
                            {conversation.user.firstname}
                          </h3>
                          <p className="text-sm text-gray">
                            {conversation.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="item-center mt-12 text-lg font-semibold">
                  No Conversations
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-[50%] bg-white h-screen flex flex-col items-center">
          {selectedUser && (
            <div className="w-[90%] h-[80px] mt-8 bg-Solitude rounded-full flex items-center px-7 ">
              <div className="cursor-pointer">
                {" "}
                <MdAccountCircle size={50} />
              </div>
              <div className="ml-6 mr-auto">
                {selectedUser && selectedUser.firstname ? (
                  <>
                    <h3 className="text-lg">{selectedUser.firstname}</h3>
                    <p className="text-sm text-gray">{selectedUser.email}</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg">{selectedUser.user.firstname}</h3>
                    <p className="text-sm text-gray">
                      {selectedUser.user.email}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
          <div
            className="h-[85%] w-full overflow-y-auto"
            style={{
              overflowY: Messages?.length > 0 ? "scroll" : "hidden",
              scrollbarWidth: "thin",
              marginBottom: Messages?.length > 0 ? 0 : 20,
            }}
          >
            {Messages?.length > 0 ? (
              Messages.map((message, index) => {
                const isSentByCurrentUser =
                  message.senderId === localStorage.getItem("token");
                const isSentByCurrentUserDb =
                  message.sender === localStorage.getItem("token");
                console.log(message.senderId);
                console.log(isSentByCurrentUser);
                return (
                  <>
                    <div
                      key={index} // Added key prop for the list items
                      className={`max-w-[50%] rounded p-2 mb-2 ${
                        isSentByCurrentUser || isSentByCurrentUserDb
                          ? "bg-Teal text-white rounded-tl-xl ml-auto"
                          : "bg-Solitude text-black rounded-tr-xl"
                      }`}
                    >
                      {message.message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              })
            ) : (
              <div className="w-200 h-50 mb-20">
                <img src={logo} alt="logo_img" />
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="p-4 w-full flex items-center">
              <input
                placeholder="Type a message...."
                value={write}
                onChange={(e) => setWrite(e.target.value)}
                className="w-[90%] border-0 shadow-lg p-4 placeholder-gray-400 rounded-full bg-Solitude focus:ring-0 focus:border-0 outline-none"
              />
              <div
                className={`ml-4 p-4 bg-Solitude rounded-full${
                  !write && " pointer-events-none"
                }`}
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  cursor: !write && "not-allowed",
                }}
                onClick={() => {
                  // if (!write.trim()) {
                  //   alert("Message cannot be empty");
                  //   return;
                  // }
                  sendMessage();
                  setWrite("");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-send"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 14l11 -11" />
                  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="w-[25%]  h-screen px-8 py-10 overflow-scroll">
          <div className="text-Teal text-lg">People</div>
          <div>
            {users.length > 0 ? (
              users.map((user) => {
                return (
                  <div
                    className="flex items-center py-4 border-b border-b-gray"
                    key={user.userId}
                    onClick={() => {
                      //console.log("mehmil is asking id", user.userId);
                      setSelectedUser({ ...user, id: user.userId });
                      //  console.log("mehmil is asking demoooooooo", selectedUser);
                      fetchMessages("new", { ...user, id: user.userId });
                    }}
                  >
                    <div className="cursor-pointer flex items-center">
                      <MdAccountCircle size={50} />
                      <div className="ml-8 my-4">
                        <h3 className="text-lg font-semibold">
                          {user.user.firstname}
                        </h3>
                        <p className="text-sm text-gray">{user.user.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="item-center mt-12 text-lg font-semibold">
                No Users
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
