import React, { useEffect } from "react";
import "./Loader.css";

const Loader = () => {
	useEffect(() => {
		// Отключаем прокрутку страницы, пока лоадер виден
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className="loader-container">
			<div className="loader-ring" />
		</div>
	);
};

export default Loader;
