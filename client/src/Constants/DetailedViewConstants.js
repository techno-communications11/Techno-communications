const users = [
  "Alishba Ahmed",
  "ALISHA PADANIYA",
  "Roshan Interview",
  "Roshan Screening",
  "Roshan Shaikh",
  "Bilal Interview",
  "Qamar Shahzad",
  "Shafaque Qureshi",
  "Sultan Interview",
  "Shoaib",
  "Kamaran Mohammed",
];

const groupStatus = [
  "Rejected",
  "Pending",
  "pending at Screening",
  "1st Round - Pending",
  "HR Round - Pending",
  "Pending at NTID",
  "NTID Created",
];

const statusMap = {
  Pending: [
    "pending at Screening",
    "moved to Interview",
    "put on hold at Interview",
    "selected at Interview",
    "Recommended For Hiring",
    "Sent for Evaluation",
    "need second opinion at Interview",
    "Applicant will think about It",
    "Moved to HR",
    "selected at Hr",
    "Store Evaluation",
    "Spanish Evaluation",
  ],
  Rejected: [
    "rejected at Screening",
    "no show at Screening",
    "Not Interested at screening",
    "rejected at Interview",
    "no show at Interview",
    "no show at Hr",
    "Not Recommended For Hiring",
    "backOut",
    "rejected at Hr",
  ],
  "pending at Screening": ["pending at Screening"],
  "1st Round - Pending": ["moved to Interview", "put on hold at Interview"],
  "HR Round - Pending": [
    "selected at Interview",
    "Sent for Evaluation",
    "need second opinion at Interview",
    "Applicant will think about It",
    "Moved to HR",
    "Recommended For Hiring",
    "Store Evaluation",
    "Spanish Evaluation",
  ],
  "Pending at NTID": ["selected at Hr"],
  "NTID Created": ["mark_assigned"],
};

const statusOrder = [
  "pending at Screening",
  "no show at Screening",
  "rejected at Screening",
  "Not Interested at screening",
  "moved to Interview",
  "no show at Interview",
  "rejected at Interview",
  "selected at Interview",
  "no show at Hr",
  "Moved to HR",
  "selected at Hr",
  "rejected at Hr",
];

export { users, groupStatus, statusMap, statusOrder };