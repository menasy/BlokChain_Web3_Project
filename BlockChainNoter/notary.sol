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
    mapping(bytes32 => bool) private documentExists;



   function uploadDocument(bytes32 docHash) external 
   {
        require(!documentExists[docHash], "Document is already exists !");
        documentsMap[docHash] = Document(docHash, block.timestamp);
        documentExists[docHash] = true; 
    }
   
    function verifyDocument(bytes32 docHash) external view returns (uint256 timestamp) 
    {
        require(documentExists[docHash], "Document not found !");
        return documentsMap[docHash].timestamp;
    }
}