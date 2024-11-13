import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";

const NewCustomer = ({ inputs, title, collectionName }) => {
	const [file, setFile] = useState("");
	const [data, setData] = useState({});
	const [per, setPerc] = useState(null);
	const { selectedCompany } = useCompanyContext();
	const navigate = useNavigate();

	useEffect(() => {
		const uploadFile = () => {
			const name = new Date().getTime() + file.name;

			const storageRef = ref(
				storage,
				`${selectedCompany}/avatars/${name}`
			);
			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					setPerc(progress);
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
						default:
							break;
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL) => {
							setData((prev) => ({ ...prev, img: downloadURL }));
						}
					);
				}
			);
		};
		file && uploadFile();
	}, [file, selectedCompany]);

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;

		setData({ ...data, [id]: value });
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			const res = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			if (data.img) {
				await updateProfile(res.user, { photoURL: data.img });
			}
			await setDoc(doc(db, collectionName, res.user.uid), {
				...data,
				timeStamp: serverTimestamp(),
			});

			navigate(-1);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="new">
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>{title}</h1>
				</div>
				<div className="bottom">
					<div className="left">
						<img
							src={
								file
									? URL.createObjectURL(file)
									: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
							}
							alt=""
						/>
					</div>
					<div className="right">
						<form onSubmit={handleAdd}>
							<div className="formInput">
								<label htmlFor="file">
									Image:{" "}
									<DriveFolderUploadOutlinedIcon className="icon" />
								</label>
								<input
									type="file"
									id="file"
									onChange={(e) => setFile(e.target.files[0])}
									style={{ display: "none" }}
								/>
							</div>

							{inputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									{input.type === "select" && (
										<select
											id={input.id}
											onChange={handleInput}
											value={data[input.id] || ""}
											required={
												input.required
													? input.required
													: false
											}
										>
											<option value="" disabled>
												{input.placeholder}
											</option>
											{input.options.map(
												(option, index) => (
													<option
														key={index}
														value={option}
													>
														{option}
													</option>
												)
											)}
										</select>
									)}
									{input.type !== "select" && (
										<input
											id={input.id}
											type={input.type}
											placeholder={input.placeholder}
											onChange={handleInput}
											value={data[input.id] || ""}
											required={
												input.required
													? input.required
													: false
											}
										/>
									)}
								</div>
							))}
							<button
								disabled={per !== null && per < 100}
								type="submit"
							>
								Send
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewCustomer;
