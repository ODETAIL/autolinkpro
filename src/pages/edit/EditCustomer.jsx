import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, companyName } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

const EditCustomer = ({ inputs, title, collectionName }) => {
	const [data, setData] = useState({});
	const { customerId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const docRef = doc(
					db,
					companyName,
					"management",
					collectionName,
					customerId
				);
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
	}, [collectionName, customerId]);

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
				companyName,
				"management",
				collectionName,
				customerId
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
									<div className="formInput" key={input.id}>
										<label>{input.label}</label>
										{input.id === "notes" ? (
											<textarea
												id={input.id}
												value={data[input.id] || ""}
												placeholder={input.placeholder}
												onChange={handleInput}
												rows={5} // Set initial height of the textarea
											/>
										) : (
											<input
												id={input.id}
												type={input.type}
												value={data[input.id] || ""}
												placeholder={input.placeholder}
												onChange={handleInput}
											/>
										)}
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

export default EditCustomer;
