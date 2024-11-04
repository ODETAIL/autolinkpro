import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
// import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useEffect, useState } from "react";
import { DarkMode } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
	const { dispatch, darkMode } = useContext(DarkModeContext);

	const { currentUser } = useContext(AuthContext);

	const [avatarUrl, setAvatarUrl] = useState(
		"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
	);

	useEffect(() => {
		const fetchAvatar = () => {
			const photoURL = currentUser?.providerData[0]?.photoURL;

			if (photoURL) setAvatarUrl(photoURL); // Set photoURL directly without URL.createObjectURL
		};
		fetchAvatar();
	}, [currentUser]);

	return (
		<div className="navbar">
			<div className="wrapper">
				<div className="search">
					<input type="text" placeholder="Search..." />
					<SearchOutlinedIcon />
				</div>
				<div className="items">
					<div className="item">
						<LanguageOutlinedIcon className="icon" />
						English
					</div>
					<div className="item">
						{darkMode ? (
							<DarkMode
								className="icon"
								onClick={() => dispatch({ type: "TOGGLE" })}
							/>
						) : (
							<DarkModeOutlinedIcon
								className="icon"
								onClick={() => dispatch({ type: "TOGGLE" })}
							/>
						)}
					</div>
					{/* <div className="item">
						<FullscreenExitOutlinedIcon className="icon" />
					</div> */}
					<div className="item">
						<NotificationsNoneOutlinedIcon className="icon" />
						{/* <div className="counter"></div> */}
					</div>
					{/* <div className="item">
						<ChatBubbleOutlineOutlinedIcon className="icon" />
						<div className="counter">2</div>
					</div> */}
					{/* <div className="item">
						<ListOutlinedIcon className="icon" />
					</div> */}
					<div className="item">
						<img src={avatarUrl} alt="" className="avatar" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
