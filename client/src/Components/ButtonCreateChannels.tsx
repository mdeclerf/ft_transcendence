import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import axios from 'axios';
import { Room } from '../utils/types';
import { socket } from '../socket';
// import { switchRoom } from '../utils/socket_helpers';

export interface SimpleDialogProps {
		open: boolean;
		setOpen: (value: boolean) => void;
		prevRoom: Room | undefined;
		switchRooms: (room: Room) => void;
	}
	
function SimpleDialog(props: SimpleDialogProps) {
	const { setOpen, open, prevRoom, switchRooms } = props;

	const [privacy, setPrivacy] = React.useState('');
	const [name, setName] = React.useState<string>('');

	const handleChangeName = (event: any) => {
		setName(event.target.value as string);
	};

	const handleClose = () => {
		setOpen(false);
		console.log(name);
		console.log(privacy);
		axios.post("http://localhost:3001/api/chat/create_channel", {name: name.toLowerCase(), type: 0, hash: ""})
			.then(() => {
				socket.emit('room_created', name);
				if (prevRoom)
					switchRooms({ name });
				else
					switchRooms({ name });
			})
			.catch(err => {
				if (err) throw err;
			});
		setName("");
		setPrivacy("");
	};

	const handleCancel = () => {
		setOpen(false);
		setName("");
		setPrivacy("");
	};


	return (
		<Dialog onClose={handleCancel} open={open}>
			<DialogTitle>Create Channel</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Create a new channel
				</DialogContentText>
				<TextField value={name} onChange={handleChangeName} label="Channel name" autoFocus margin="normal" variant="standard" fullWidth sx={{mb:2}}/>
					{/* <FormControl fullWidth>
							<InputLabel> Privacy </InputLabel>
							<Select
							fullWidth
								value={privacy}
								label="Privacy"
								onChange={handleChangePrivacy}
							>
								<MenuItem value={'public'}>Public</MenuItem>
								<MenuItem value={'protected'}>Protected</MenuItem>
								<MenuItem value={'private'}>Private</MenuItem>
							</Select>
					</FormControl>   */}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleClose}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

export interface IButtonCreateChannelsProps {
	prevRoom: Room | undefined;
	switchRooms: (room: Room) => void;
};

export const ButtonCreateChannels = (props: IButtonCreateChannelsProps) => {
	const { prevRoom, switchRooms } = props;
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	
	return (
		<div>
			<Button sx={{marginTop:"2%"}} variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen} fullWidth>
				Create channel
			</Button>
			<SimpleDialog
				open={open}
				setOpen={setOpen}
				prevRoom={prevRoom}
				switchRooms={switchRooms}
			/>
		</div>
	)
}