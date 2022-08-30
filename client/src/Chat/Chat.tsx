import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { VerticalTabs } from '../Components/VerticalTabs';
import { getIsBlocked } from '../utils/api';
import { socket } from '../socket';
import { useFetchCurrentUser } from '../utils/hooks/useFetchCurrentUser';
import { fetchRoomMessages, fetchRooms, leaveChat, sendMessage, subscribeToMessages, subscribeToNewRoom, subscribeToRoomUserJoin, subscribeToRoomUserLeave, subscribeToRoomUserList, switchRoom } from '../utils/socket_helpers';
import { CenteredDiv } from '../utils/styles';
import { Message, Room, User } from '../utils/types';

export interface IChatProps {
	socketLoading: boolean;
}

export function Chat (props: IChatProps) {

	const { socketLoading } = props;
	const { user } = useFetchCurrentUser();
	const [message, setMessage] = useState("");
	const [room, setRoom] = useState<Room>({ name: "general", type: 'public' });
	const [rooms, setRooms] = useState<Room[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [roomsLoading, setRoomsLoading] = useState(true);
	const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
	const [ owner, setOwner ] = React.useState<boolean>(false);
	const [ admin, setAdmin ] = React.useState<boolean>(false);
	const [ mute, setMute ] = React.useState<boolean>(false);

	const prevRoomRef = useRef<Room>();
	useEffect(() => {
		prevRoomRef.current = room;
	});
	const prevRoom = prevRoomRef.current;

	useEffect(() => {
		return (() => {
			leaveChat(room.name);
		})
	// eslint-disable-next-line
	}, [])

	// switch switch room in the backend when it changes in the frontend
	useEffect(() => {
		getChatUserStatus().then((res: string | undefined) => {
			if (res) {
				if (res === 'owner') {
					setOwner(true);
					setAdmin(true);
					setMute(false);
				}
				if (res === 'admin') {
					setAdmin(true);
					setOwner(false);
					setMute(false);
				}
				if (res === 'user') {
					setAdmin(false);
					setOwner(false);
					setMute(false);
				}
				if (res === 'muted') {
					setAdmin(false);
					setOwner(false);
					setMute(true);
				}
			}
		});

		if (!socketLoading) {
			if (prevRoom && room) {
				switchRoom(prevRoom.name, room.name);
				setRoom(room);
			}
		}
	// eslint-disable-next-line
	}, [room, socketLoading, owner]);

	// get available rooms
	useEffect(() => {
		fetchRooms().then((res: Room[]) => {
			setRooms(res);
			setRoomsLoading(false);
		});

		subscribeToMessages((data) => {
			getIsBlocked(data.user.id)
			.then((res) => {
				if (!res.data) {
					setMessages((messages) => [...messages, data]);
				}
			});
		});

		subscribeToRoomUserList((data) => {
			setConnectedUsers([]);
			setConnectedUsers(data);
		});
		
		subscribeToRoomUserJoin((data) => {
			setConnectedUsers((users) => [...users, data]);
		});
		
		subscribeToRoomUserLeave((data) => {
			setConnectedUsers((users) => users.filter(user => user && data && user.id !== data.id));
		});

		subscribeToNewRoom((data) => {
			setRooms((oldRooms) => [...oldRooms, data]);
		});
	// eslint-disable-next-line
	}, []);

	// get messages for currently set room
	useEffect(() => {
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages('general').then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
	}, []);



	useEffect(() => {
		handleAdmin(room.name);
	}, [admin, room.name]);
	
	const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value);
	}
	
	const handleAdmin = (name: string) => {
		socket.on('admin_added', data => {
			if (name === data) {
				setAdmin(true);
			}
		})
	}

	const handleMessageSend = () => {
		if (!message || !user) return;

		const data: Message = { room: room, body: message, user };
		setMessages((messages) => [...messages, data]);
		sendMessage(data);
		setMessage("");
	}

	const handleSwitchRoom = (targetRoom: Room) => {	
		setOwner(false);
		setMessages([]);
		setMessagesLoading(true);

		fetchRoomMessages(targetRoom.name).then((res: Message[]) => {
			setMessages(res);
			setMessagesLoading(false);
		});
		setRoom(targetRoom);
	}

	async function getChatUserStatus(): Promise<string | undefined> {
		if (user && room)
		{
			const response = await axios.get<string>(`http://localhost:3001/api/chat/rooms/${room.name}/${user.username}/get_chat_user_status`, { withCredentials: true });
			if (response)
				return response.data;
		}
		else
			return ;
	}

	if (roomsLoading) return <CenteredDiv><CircularProgress /></CenteredDiv>

	return (
		<VerticalTabs
			mute={mute}
			room={room}
			admin={admin}
			owner={owner}
			rooms={rooms}
			message={message}
			messages={messages}
			currentUser={user}
			switchRooms={handleSwitchRoom}
			messagesLoading={messagesLoading}
			messageChange={handleMessageChange}
			messageSend={handleMessageSend}
			roomUsers={connectedUsers}
		/>
	);
}
