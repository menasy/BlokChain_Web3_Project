async function getFileHash(fileInputId) {
	const fileInput = document.getElementById(fileInputId);
	const file = fileInput.files[0];

	if (!file) {
		alert("Lütfen önce bir dosya seçin!");
		throw new Error("Dosya seçilmedi!");
	}

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(e.target.result)); // DÖNÜŞÜM ÖNEMLİ!
			const hashHex = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
			resolve("0x" + hashHex);
		};
		reader.onerror = (error) => reject(error);
		reader.readAsArrayBuffer(file);
	});
}

async function createContract(needsSigner = false) {
	if (typeof window.ethereum === 'undefined') {
		alert("Lütfen Metamask'ı yükleyin ve sayfayı yeniden açın!");
		throw new Error("Metamask bulunamadı (window.ethereum undefined)");
	}
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	if (needsSigner) {
		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		return new ethers.Contract(
			"0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE",
			["function uploadDocument(bytes32)", "function verifyDocument(bytes32) view returns (uint256)"],
			signer
		);
	}
	return new ethers.Contract(
		"0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE",
		["function verifyDocument(bytes32) view returns (uint256)"],
		provider
	);
}


async function uploadHash() {
	try {
		const hash = await getFileHash("uploadInput");
		console.log("Hash Upload: " + hash + "\n");
		const contract = await createContract(true);
		const tx = await contract.uploadDocument(hash); // transactionu alıyoruz.
		await tx.wait(); // mined edilmesini bekletiyrum işlemin bloğa kaydedilmesi lazım.
		console.log("TRANSACTİON: ", tx.hash + "\n");
		document.getElementById("result").innerHTML = "Hash blockchain'e kaydedildi! ";
	} catch (error) {
		document.getElementById("result").innerHTML = `Hata: ${error.message}`;
	}
}

async function verifyHash() {
	try {
		const hash = await getFileHash("verifyInput");
		console.log("Hash Verify: " + hash + "\n");
		const contract = await createContract();
		console.log("1---------------Create");
		const timestamp = await contract.verifyDocument(hash);
		console.log("2---------------Timstamp: " + timestamp);

		if (timestamp > 0) {
			const date = new Date(timestamp * 1000).toLocaleString();
			document.getElementById("result").innerHTML = ` Belge doğrulandı!<br>Zaman Damgası: ${date}`;
		} else {
			document.getElementById("result").innerHTML = " Belge blockchain'de bulunamadı!";
		}
	} catch (error) {
		console.error("Hata Detayları:", error);
		if (error.code === "CALL_EXCEPTION") {
			document.getElementById("result").innerHTML = "Belge blockchain'de bulunamadı!";
		} else {
			document.getElementById("result").innerHTML = `Hata: ${error.message}`;
		}
	}
}