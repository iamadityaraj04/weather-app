const express=require('express');
const http=require('https');

//use to get data from forms
const bodyparser=require('body-parser');

const app=express();
const port=8000;

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+ "/index.html");
})

app.post("/",(req,res)=>{
    const query=req.body.cityName;
    if(query!=""){
        //using api
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${query},IN&appid=0528485ff519446f70f972285abcef76&units=metric`;
        http.get(url,(response)=>{
            //it gives whole data
            /* console.log(response); */
    
            console.log(response.statusCode);
            response.on("data",(data)=>{
                //converting data to json format to extract needful data
                const weatherData=JSON.parse(data);
                
                //getting data from JSON file
                const temp=weatherData.main.temp;
                const weatherDes=weatherData.weather[0].description;
                const weatherIcon=weatherData.weather[0].icon;
                const imageURL=`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
                res.write(`
                <body >
                <h1 style="text-transform:uppercase ; margin-left:50px; margin-top:50px;">${query}</h1>
                <span style="font-size: 70px; margin-left:50px;">${temp}</span><span style="color:lightgrey ; font-size: 70px;">  &#8451</span><br>
                <img src="${imageURL}" width="100px" style="margin-left:50px;">
                <h1 style="text-transform:uppercase ; margin-left:50px;">${weatherDes}</h1>
                </body>
                `);
                res.send();   
            })
        })
    }else{
        res.write(`<script>alert("Please Enter City Name!");</script>`);
        res.send();
    }
})
app.listen(port,()=>{
    console.log(`Server has started on port ${port} ...`);
})