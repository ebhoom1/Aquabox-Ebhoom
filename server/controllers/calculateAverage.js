const IotData = require(`../models/iotData`);
const IotDataAverage = require(`../models/averageData`);

const calculateAverage = async ( userId, averageType, startTime,endTime) =>{
    const data =await IotData.find({
        userId:userId,
        timestamp:{
            $gte:startTime,
            $lt:endTime
        }
    });

    if(data.length === 0){
        return;
    }
    const fields =['ph', 'TDS', 'turbidity', 'temperature', 
                    'BOD', 'COD', 'TSS', 'ORP', 'nitrate',
                     'ammonicalNitrogen','DO', 'chloride', 
                    'PM10', 'PM25', 'NOH', 'NH3', 'WindSpeed',
                    'WindDir', 'AirTemperature', 'Humidity', 
                    'solarRadiation', 'DB'];

    const averages=fields.reduce((acc,fields)=>{
        acc[fields] = data.reduce((sum,item)=> sum + parseFloat(item[fields] || 0),0) /data.length;
        return acc;
    },{});

    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();

    const averageEntry = await IotDataAverage.findOne({userId})

    if(averageEntry){
        for(let field of fields){
            averageEntry[field][averageType] ={
                value:averages[field],
                time:currentTime,
                date:currentDate,
            };
        }
        await averageEntry.save();
    }else {
        const newEntry ={
            userId:userId,
            userName:data[0].userName,
            timestamp:new Date()

        };
        for(let field of fields){
            newEntry[field] = {
                [averageType]:{
                    value:averages[field],
                    time:currentTime,
                    date:currentDate,
                }
            };
        }
        const newAverageEntry = new IotDataAverage(newEntry);
        await newAverageEntry.save();
    }
  
};

const calculateAndSaveAverages = async () =>{
    const users = await IotData.distinct('userId');

    for(let userId of users){
        const now = new Date();

        //Hourly average
        await calculateAverage(userId,'hour', new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours()-1),now);

        //Daily average
        await calculateAverage(userId,'day', new Date(now.getFullYear(),now.getMonth(),now.getDate()-1),now);

        //Monthly average
        await calculateAverage(userId,'month', new Date(now.getFullYear(),now.getMonth()-1),now);

        //Six-monthly average
        await calculateAverage(userId,'sixmonth', new Date(now.getFullYear(), now.getMonth()-6),now);


        //Yearly average
        await calculateAverage(userId, 'year',new Date(now.getFullYear()-1),now);

    }
}

module.exports ={ calculateAndSaveAverages}