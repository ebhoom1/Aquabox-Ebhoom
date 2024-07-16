const axios = require('axios');
const moment = require('moment');

async function sendData() {
    try {
        const data = {
            userName: 'abc001',
            email: 'abc@gmail.com',
            mobileNumber: 9876543210,
            companyName: 'ABC',
            industryType: 'userDetails.XYZ', // Assuming userDetails.XYZ is a placeholder or a variable you have
            timestamp: moment().format('DD/MM/YYYY'),
            time: moment().format('HH:mm:ss'),
            //Example values to we can replace with what value you are sending 
            ph:'1',
            TDS:'2',
            COD:'3',

        };

        const response = await axios.post('http://ocems.ebhoom.com:5555/api/handleSaveMessage', data);
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

sendData();



// it must after some time after all test 
// just mock setup how to send data to our api