// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract DocumentNotary 
{
    struct Document 
    {
        bytes32 hash;
        uint256 timestamp;
    }

    mapping(bytes32 => Document) private documentsMap;

    event DocumentStored(bytes32 indexed documentHash, uint256 timestamp); // emit tetiklediğinde loga kayıt düşer frontdan bu kaydı alacağım

    function uploadDocument(bytes32 docHash) external 
    {
        require(documentsMap[docHash].timestamp == 0, "File is already exist !");
        documentsMap[docHash] = Document(docHash, block.timestamp);
        emit DocumentStored(docHash, block.timestamp); // -> eventi tetikliyoruz burda 
    }

    function verifyDocument(bytes32 docHash) external view returns (uint256 timestamp) 
    {
        return documentsMap[docHash].timestamp;
    }
}