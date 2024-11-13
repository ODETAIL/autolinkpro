import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "../../context/CompanyContext";

const NewCustomer = ({ inputs, title, collectionName }) => {
	const [data, setData] = useState({});
	const navigate = useNavigate();

	const { selectedCompany } = useCompanyContext();

	const handleInput = (e) => {
		const id = e.target.id;
		const value = e.target.value;

		setData({ ...data, [id]: value });
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await addDoc(
				collection(
					db,
					`${selectedCompany}`,
					"management",
					collectionName
				),
				{
					...data,
					timeStamp: serverTimestamp(),
				}
			);
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
					<div className="right">
						<form onSubmit={handleAdd}>
							<div className="formContent">
								{inputs.map((input) => (
									<div className="formInput" key={input.id}>
										<label>{input.label}</label>
										<input
											id={input.id}
											type={input.type}
											placeholder={input.placeholder}
											onChange={handleInput}
											required={
												input.required
													? input.required
													: false
											}
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

export default NewCustomer;
