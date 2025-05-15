
export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_caseId",
				"type": "string"
			}
		],
		"name": "AcceptCase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_caseId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addCase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_cfslAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addCFSL",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			}
		],
		"name": "addDigitalSignature",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_fslAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addFSL",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addFSLMember",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_policeStation",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "addPoliceStation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "cfslAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "CFSLAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "fssAddress",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "ipfsHash",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isAcceptedByFSL",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "policeStationAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "finalReportId",
						"type": "uint256"
					}
				],
				"indexed": false,
				"internalType": "struct ForensicReport.Case",
				"name": "_case",
				"type": "tuple"
			}
		],
		"name": "CaseAcceptedByFSL",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "caseId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "policeStation",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "CaseAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "member",
				"type": "address"
			}
		],
		"name": "DigitalSignatureAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "cfslAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "FSLAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "member",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			}
		],
		"name": "FslMemberAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_caseId",
				"type": "string"
			},
			{
				"internalType": "address[]",
				"name": "_members",
				"type": "address[]"
			},
			{
				"internalType": "address",
				"name": "_reportHead",
				"type": "address"
			}
		],
		"name": "initializeTestReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "policeStation",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "PoliceStationAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "reportId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "caseId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "head",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address[]",
				"name": "members",
				"type": "address[]"
			}
		],
		"name": "TestReportInitialized",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "uploadTestReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allCFSLs",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allFSLs",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allPoliceStations",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_reportId",
				"type": "string"
			}
		],
		"name": "allSignaturesCollected",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "cases",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isAcceptedByFSL",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "policeStationAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "finalReportId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "cfslMapping",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "finalReportCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "finalReports",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "caseId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "fslMapping",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "cfslAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "fslMembers",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_caseId",
				"type": "string"
			}
		],
		"name": "getFinalReport",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "ipfsHash",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "testReportIds",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "caseId",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "fslAddress",
						"type": "address"
					}
				],
				"internalType": "struct ForensicReport.FinalFSLReport",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "policeStationMapping",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "fslAddress",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "testReports",
		"outputs": [
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "caseId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "reportHead",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isReportFinalized",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const CONTRACT_ADDRESS = "0xFd59F9b0cfBecB9C1498C4eEef65B64A0E09E1f0"; // Replace with actual contract address

export const INDIAN_GOVT_ADDRESS = "0x79D29913E7380F67E9b9c241bDa7c169b7f961D7"; // Replace with actual address

export const USER_ROLES = {
  INDIAN_GOVT: "INDIAN_GOVT",
  CFSL: "CFSL",
  FSL: "FSL",
  POLICE_STATION: "POLICE_STATION",
  FSL_MEMBER: "FSL_MEMBER",
  NONE: "NONE",
};

export const EVENT_NAMES = {
  CFSL_ADDED: "CFSLAdded",
  FSL_ADDED: "FSLAdded",
  FSL_MEMBER_ADDED: "FslMemberAdded",
  POLICE_STATION_ADDED: "PoliceStationAdded",
  CASE_ADDED: "CaseAdded",
  CASE_ACCEPTED_BY_FSL: "CaseAcceptedByFSL",
  TEST_REPORT_INITIALIZED: "TestReportInitialized",
  DIGITAL_SIGNATURE_ADDED: "DigitalSignatureAdded",
};
