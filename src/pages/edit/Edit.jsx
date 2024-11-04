import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";

const Edit = ({ inputs, title, collectionName }) => {
	const [data, setData] = useState({});
	const { userId } = useParams();
	const { selectedCompany } = useCompanyContext();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docRef = doc(
					db,
					selectedCompany,
					"management",
					collectionName,
					userId
				);
				console.log(docRef);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setData(docSnap.data());
				} else {
					setData({ error: "Document not found" });
				}
			} catch (error) {
				console.error("Error fetching document: ", error);
			}
		};

		fetchData();
	}, [collectionName, userId, selectedCompany]);

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;

		setData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		try {
			const docRef = doc(
				db,
				selectedCompany,
				"management",
				collectionName,
				userId
			);
			await updateDoc(docRef, {
				...data,
				timeStamp: serverTimestamp(),
			});
			navigate(-1);
		} catch (err) {
			console.error("Error updating document:", err);
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
					<div className="right">
						<form onSubmit={handleEdit}>
							<div className="formContent">
								{inputs.map((input) => (
									<div className="formInput" key={input?.id}>
										<label>{input?.label}</label>
										<input
											id={input?.id}
											type={input?.type}
											value={data[input?.id] || ""}
											placeholder={input?.placeholder}
											onChange={handleInput}
										/>
									</div>
								))}
							</div>
							<button type="submit">Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Edit;
