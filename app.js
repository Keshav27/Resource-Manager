var express=require('express')
var bp=require('body-parser')
var app=express()
var fs = require('fs');
var urlencodedParser=bp.urlencoded({extended:false})
var mongoose=require('mongoose')
var session=require('client-sessions')
var nodemailer = require('nodemailer');
app.set( 'port', ( process.env.PORT || 5000 ));

app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));
app.use( express.static( "views" ) );
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json({extended:false}));
var allocated="";

require('./EmployeeSchema')
require('./ResourceSchema')
require('./RequestSchema')
mongoose.connect('mongodb+srv://keshav27:keshav27@cluster0-mtsng.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });
var Employee=mongoose.model('EmployerDB')
var Resource=mongoose.model('Resource')
var Requester=mongoose.model('Request')

app.use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

var email=""
var ename=""
app.post('/login_validation',function(req,res){

    console.log(req.body.empid+"'   '"+req.body.empass);
    if(req.body.empid==''){
        res.send({status :'Invalid'});
    }else{
        Employee.find({empid : req.body.empid},(err,docs)=>{
            if(docs.length==0){
                res.send({status:'Invalid'});
            }else if(err){
                console.log(err);
            }else{
                email=docs[0].email;
                ename=docs[0].name;
                var pass=req.body.empass;
                var dpass=docs[0].password;
                if(pass==dpass){
                    //console.log("EQUAL")
                    var emp={
                        empid:req.body.empid
                    }
                    req.session.emp=emp;
                    res.send({status:'home'})
                }else{
                   // console.log("NOT EQUAL")
                    res.send({status:'Invalid'});
                }
            }
        })
    }
})
app.get('/register',function(req,res){
    res.render('register.ejs');
})
app.post('/registration',function(req,res){

    Employee.find({empid: req.body.empid},(err,docs)=>{
        if(err){
            console.log(err);
        }
        if(Object.keys(docs).length!=0){
            res.send({status:'Error'});
        }else{
            var emp= new Employee();
            emp.empid=req.body.empid;
            emp.name=req.body.name;
            emp.password=req.body.password;
            emp.email=req.body.email;
            emp.contactno=req.body.contactno;
            emp.save((err,doc)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log('Inserted');
                }
            })
            res.send({status:'Registered'});
        }
    })
})
app.get('/regerror',function(req,res){
    res.render('regerrpage.ejs');
})

app.get('/Resources',function(req,res){


    Requester.find({resholdername: email},(err,docs)=>{
        if(err){
            console.log(err);
        }
        if(Object.keys(docs).length!=0){

            var name=docs[0].resourcewant;
            console.log(name);
            res.render('accept.ejs',{namee:name});
        }
        else{   
             var r1color,r2color,r3color,r4color,r5color;
             Resource.find({resname: "R1"},(err,docs)=>{
                if(err){
                    console.log(err);
                }
                if(Object.keys(docs).length!=0){
                    r1color="#ff0000";
                }
                else{
                    r1color="#4CAF50";
                }
                Resource.find({resname: "R2"},(err,docs)=>{
                    if(err){
                        console.log(err);
                    }
                    if(Object.keys(docs).length!=0){
                        r2color="#ff0000";
                    }
                    else{
                        r2color="#4CAF50";
                    }
                    Resource.find({resname: "R3"},(err,docs)=>{
                        if(err){
                            console.log(err);
                        }
                        if(Object.keys(docs).length!=0){
                            r3color="#ff0000";
                        }
                        else{
                            r3color="#4CAF50";
                        }
                        Resource.find({resname: "R4"},(err,docs)=>{
                            if(err){
                                console.log(err);
                            }
                            if(Object.keys(docs).length!=0){
                                r4color="#ff0000";
                            }
                            else{
                                r4color="#4CAF50";
                            }
                            Resource.find({resname: "R5"},(err,docs)=>{
                                if(err){
                                    console.log(err);
                                }
                                if(Object.keys(docs).length!=0){
                                    r5color="#ff0000";
                                }
                                else{
                                    r5color="#4CAF50";
                                     }
                                     res.render('Resources.ejs',{c1:r1color,c2:r2color,c3:r3color,c4:r4color,c5:r5color})
                                })
                            })
                        })
                    })
                
                })
        }
    })




})

app.get('/Resource/:id',function(req,res){
    var c=req.param('id');
    resourcename=req.param('id');
    Resource.find({resname:resourcename},(err,docs)=>{
        if(err){
            console.log(err);
        }
        if(Object.keys(docs).length!=0){
            holder=docs[0].username;
            var t=docs[0].restime;
            var d=new Date(t);
            var r=d.getTime();
            let currenttime = Date.now();
            if(currenttime<r){
             res.render('request.ejs');
            }
            else{
            iffind="yes";
            }
        }
        else{
            res.render('alocation.ejs');
        }
    })

})
var holder="";
var resourcename="";
var iffind="no";
app.post('/Resource/:id',function(req,res){
    console.log(req.param);
    var c=req.param('id');
    console.log(c);
    resourcename=req.param('id');    
    res.render('alocation.ejs');
})
app.get('/alocation',function(req,res){
    res.render('alocation.ejs');
})

app.post('/alocation',function(req,res){
    Resource.find({resname:resourcename},(err,docs)=>{
        if(err){
            console.log(err);
        }
        if(iffind=="yes"){
            
            var obj=mongoose.model('Resource');
            obj.findOneAndUpdate({resname:resourcename},{$set:{restime:req.body.usertime,username:req.body.username}},function(err,doc){
                if (err) {
                    console.log("update document error");
                } else {
                    console.log("update document success");
                }
            })
            res.render('login.ejs');
            
            
        }
        else{
            let currenttime = Date.now();
            var requesttime=req.body.usertime;
            var myDate = new Date(requesttime);
            var result = myDate.getTime();
        
            var resour=new Resource();
            resour.resname=resourcename;
            resour.restime=req.body.usertime;
            resour.username=email;
            resour.save((err,doc)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Inserted');
            }
            })
            //res.render('login.ejs');
            

        }
    })
    res.send("bye")
})

app.get('/accept',function(req,res){
    res.render('accept.ejs');
})

app.get('/back',function(req,res){
    res.render('Resources.ejs');
})
app.post('/back',function(req,res){
    res.render('Resources.ejs');
})
app.post('/accept',function(req,res){   
    var want=""
    Requester.find({resholdername:email},(err,docs)=>{
        if(err){
            console.log(err);
        }
        if(Object.keys(docs).length!=0){
            want=docs[0].resourcewant;
            console.log("=====>"+want);
        }
    })
        var obj1=mongoose.model('Request');
        obj1.deleteOne({resholdername:email},{resourcewant:want},function(err,doc){
                if (err) {
                   console.log("delete error");
                } else {
                    console.log("delete success");
                }
            })

    var obj=mongoose.model('Resource');
    obj.deleteOne({username:email},{resname:want},function(err,doc){
            if (err) {
               console.log("delete error");
            } else {
                console.log("delete success");
            }
        })
        Requester.find({resholdername: email},(err,docs)=>{
            if(err){
                console.log(err);
            }
            if(Object.keys(docs).length!=0){
    
                var name=docs[0].resourcewant;
                console.log(name);
                res.render('accept.ejs',{namee:name});
            }
            else{   
                 var r1color,r2color,r3color,r4color,r5color;
                 Resource.find({resname: "R1"},(err,docs)=>{
                    if(err){
                        console.log(err);
                    }
                    if(Object.keys(docs).length!=0){
                        r1color="#ff0000";
                    }
                    else{
                        r1color="#4CAF50";
                    }
                    Resource.find({resname: "R2"},(err,docs)=>{
                        if(err){
                            console.log(err);
                        }
                        if(Object.keys(docs).length!=0){
                            r2color="#ff0000";
                        }
                        else{
                            r2color="#4CAF50";
                        }
                        Resource.find({resname: "R3"},(err,docs)=>{
                            if(err){
                                console.log(err);
                            }
                            if(Object.keys(docs).length!=0){
                                r3color="#ff0000";
                            }
                            else{
                                r3color="#4CAF50";
                            }
                            Resource.find({resname: "R4"},(err,docs)=>{
                                if(err){
                                    console.log(err);
                                }
                                if(Object.keys(docs).length!=0){
                                    r4color="#ff0000";
                                }
                                else{
                                    r4color="#4CAF50";
                                }
                                Resource.find({resname: "R5"},(err,docs)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    if(Object.keys(docs).length!=0){
                                        r5color="#ff0000";
                                    }
                                    else{
                                        r5color="#4CAF50";
                                         }
                                         res.render('Resources.ejs',{c1:r1color,c2:r2color,c3:r3color,c4:r4color,c5:r5color})
                                    })
                                })
                            })
                        })
                    
                    })
            }
        })
    
})


app.get('/reject',function(req,res){
    res.render('accept.ejs');
})


app.post('/reject',function(req,res){
})


app.get('/request',function(req,res){
    res.render('request.ejs');
})

app.post('/request',function(req,res){
    
    

   var requester= new Requester();
   requester.requestmaker=email;
   requester.resourcewant=resourcename;
   requester.resholdername=holder;
   requester.save((err,doc)=>{
       if(err){
           console.log(err);
       }else{
           console.log('Inserted');
       }
   })



    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nodesender775@gmail.com',
          pass: 'hellonodejs'
        }
      });
      
      var mailOptions = {
        from: 'nodesender775@gmail.com',
        to: holder,
        subject: 'Sending Email using Node.js',
        text: 'Someone has requested for the resource you are holding.'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.send('Done');
})


app.get('/',function(req,res){
    res.render('login.ejs');
});


app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
    });