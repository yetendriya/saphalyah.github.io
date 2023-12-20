const express = require('express')
const twilio = require('twilio')
const dotenv = require('dotenv')
const cors = require('cors');
const XLSX = require('xlsx')
const app = express()
app.use(cors());
dotenv.config()

async function sendSMS(req, res)
{
    try{
    const workbook = XLSX.readFile('output_results.xlsx');
    const sheetName = workbook.SheetNames[0];
    const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
// Assume this is your logic to get the top 5 faulty pulleys
    const top5FaultyPulleys = getTop5FaultyPulleys(excelData);
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    const smsMessage = `Top 5 Faulty Pulleys: \n${top5FaultyPulleys.map(pulley => `ID: ${pulley.Id}, Failure Percentage: ${pulley.Failure_Percentage.toFixed(2)}`).join('\n ')}`;
    const message = await client.messages.create({
    body: smsMessage, 
    from:'+12058903688', 
    to: process.env.PHONE_NUMBER
});
console.log(message, "Message Sent");
        res.json({ message: 'SMS sent successfully' });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Failed to send SMS' });
    }
}


function getTop5FaultyPulleys(excelData) {
    // Your logic to get the top 5 faulty pulleys goes here
    // For now, let's just sort the data by Failure_Percentage in descending order
    const sortedData = excelData.sort((a, b) => b.Failure_Percentage - a.Failure_Percentage);

    // Take the top 5 pulleys
    const top5Pulleys = sortedData.slice(0, 5);

    return top5Pulleys;
}

app.post('/send-sms',sendSMS);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
