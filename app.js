const express=require('express');
const request=require('request');
const bodyParser=require('body-parser');
const path=require('path');

const app=express();

//body parser 
app.use(bodyParser.urlencoded({extended:true}));
//static folder
app.use(express.static(path.join(__dirname,'public')));

//Signup route
app.post('/signup',(req,res)=>
{
    const {firstName,lastName,email}=req.body;
    
    if(!firstName||!lastName||!email)
    {
        res.redirect('/failure.html');
        return;
    }
    // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

    const options={
        url:'https://us8.api.mailchimp.com/3.0/lists/2f43359015',
        method:'POST',
        headers: {
            Authorization: 'auth 5b00c7167532bc8cc78db29b9ec46ae8-us8'
        },
        body: postData
    }
    request(options,(err,response,body)=>
    {
        if(err)
        {
            res.redirect('/failure.html');
        }
        else
        {
            if(response.statusCode===200)
            {
                res.redirect('/success.html');
            }
            else
            {
                res.redirect('/failure.html');
            }
        }
    });
})

const PORT=process.env.PORT||5000; 
app.listen(PORT,console.log(`server started on ${PORT}`));
