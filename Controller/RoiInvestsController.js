
const roiInvestmodel = require('../Model/RoiInvestsModel');


const calculateTotalPayback = async (req, res) => {
    try {
        const { userId } = req.params;
        const investments = await roiInvestmodel.find({ userId });

        if (!investments.length) {
            return res.status(404).json({ message: 'No investments found for this user' });
        }

        const totalPayback = investments.reduce((total, investment) => {
            return total + investment.paybackhistory.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        }, 0);

        res.status(200).json({ succss: true, totalPayback });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message })
    }
};

const getLatestPaybackEntry = async (req, res) => {
    try {
        const { investmentId } = req.params;
        const investment = await roiInvestmodel.findById(investmentId);

        if (!investment) {
            return res.status(404).json({ succss: false, message: 'Investment not found' });
        }

        const totalPayback = investment.paybackhistory.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        const latestEntry = investment.paybackhistory.length ? investment.paybackhistory[investment.paybackhistory.length - 1] : null;

        res.status(200).json({ succss: true, latestEntry, totalPayback });
    } catch (err) {
        return res.status(500).json({ succss: false, message: err.message })
    }
};


module.exports = { calculateTotalPayback, getLatestPaybackEntry }