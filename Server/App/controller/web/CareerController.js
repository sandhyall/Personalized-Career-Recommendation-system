const CareerForm = require("../model/CareerFormModel");

exports.analyzeCareer = async (req, res) => {
  try {
    const data = req.body;

    // Save to DB
    const savedData = await CareerForm.create(data);

    // Simple recommendation logic
    let recommendation = "Explore different fields";

    if (data.interestArea === "tech") {
      recommendation = "Software Developer / Web Developer";
    } else if (data.interestArea === "business") {
      recommendation = "Business Analyst / Marketing";
    } else if (data.interestArea === "design") {
      recommendation = "UI/UX Designer";
    }

    res.status(200).json({
      success: true,
      recommendation,
      data: savedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};