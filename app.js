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
                <body style="background-color:rgb(0, 119, 198);">
                <center>
                <div style="
                background-color: white;
                border:none; 
                width: 325px; 
                height: 450px; 
                border-radius: 10px; 
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top:100px;
                box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
                -webkit-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
                -moz-box-shadow: -1px 0px 5px 4px rgba(0,0,0,0.41);
                ">
                <center>
                <h1 style="text-transform:uppercase;">${query}</h1>
                <span style="font-size: 70px;">${temp}</span><span style="color:lightgrey ; font-size: 70px;">  &#8451</span><br>
                <img src="${imageURL}" width="100px" >
                <h1 style="text-transform:uppercase ;">${weatherDes}</h1>
                </center>
                </div>
                </center>
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