const express=require("express");
const proposal=require("../controllers/Proposal/Crud");
const protect=require("../middleware/authMiddleware");

const router = express.Router();

// Proposal routes
router.post("/createProposal/:userId/:jobId", protect.verifyToken, proposal.createProposal);
router.get("/getProposal",proposal.getProposal);
router.get("/getProposalsByJob/:jobId",proposal.getProposalsByJob);
router.get("/getProposal/:id",proposal.getAProposalById);
router.delete("/deleteProposal/:userId/:proposalId",protect.verifyToken,proposal.deleteProposal);


module.exports = router;
