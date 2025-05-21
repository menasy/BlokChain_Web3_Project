const contractAdress = "0x5a23e1400c9eE557544C5B8247153422d51293E3";
const contractABI = [
	{

				"inputs": [
					{
						"indexed": true,
						"internalType": "bytes32",
						"name": "documentHash",
						"type": "bytes32"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "DocumentStored",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "docHash",
						"type": "bytes32"
					}
				],
				"name": "uploadDocument",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "docHash",
						"type": "bytes32"
					}
				],
				"name": "verifyDocument",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			}
	];

async function getFileHash(fileInputId) 
{
	const fileInput = document.getElementById(fileInputId);
	const file = fileInput.files[0];

	if (!file) 
	{
		alert("Lütfen önce bir dosya seçin!");
		throw new Error("Dosya seçilmedi!");
	}

	return new Promise((resolve, reject) => 
	{
		const reader = new FileReader();
		reader.onload = (e) => 
		{
			const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(e.target.result)); // DÖNÜŞÜM ÖNEMLİ!
			const hashHex = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
			resolve("0x" + hashHex);
		};
		reader.onerror = (error) => reject(error);
		reader.readAsArrayBuffer(file);
	});
}

async function createContract(needsSigner = false) 
{

	if (!window.ethereum) throw new Error("MetaMask yüklü değil!");
	
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const network = await provider.getNetwork();
	if (network.chainId !== 11155111) 
	{
		await window.ethereum.request({method: "wallet_switchEthereumChain", params: [{ chainId: "0xAA36A7" }]});
	}
	if (needsSigner) {
		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		return new ethers.Contract(contractAdress,contractABI,signer);
	}
	return new ethers.Contract(contractAdress,contractABI,provider);
} 

async function uploadHash() {
	try 
	{
		const hash = await getFileHash("uploadInput");
		const contract = await createContract(true);
		const tx = await contract.uploadDocument(hash);
		await tx.wait();
		document.getElementById("result").innerHTML = `Belge başarıyla kaydedildi`;
	} 
	catch (error) 
	{
		let errorMessage = error.message;
		if (error.code === 'ACTION_REJECTED') {
			errorMessage = "İşlem iptal edildi !";
		}
		else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') 
		{
			errorMessage = "Belge zaten kayıtlı !";
		}
		document.getElementById("result").innerHTML = `Hata: ${errorMessage}`;
	}
}

async function verifyHash() {
	try 
	{
		const hash = await getFileHash("verifyInput");
		const contract = await createContract();
		const timestamp = await contract.verifyDocument(hash);
		const date = new Date(timestamp * 1000).toLocaleString();
		document.getElementById("result").innerHTML = ` Belge doğrulandı !<br>Zaman Damgası: ${date}`;
	} 
	catch (error) 
	{
		if (error.message.includes("Document not found !")) {
			document.getElementById("result").innerHTML = "Belge blockchain'de mevcut değil !";
		}
		else {
			document.getElementById("result").innerHTML = `Hata: ${error.message}`;
		}
	}
}