// requirement 
require('dotenv').config();

// dependencies 

const pg=require('pg');
const express=require('express');
const methodOverride=require('method-override');
const cors=require('cors');
const superagent=require('superagent');

// main variables 

const PORT= process.env.PORT || 3030 ;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();

// uses 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
// app.use('*',notFoundHandler);
// app.use(errorHandler);

// listen to port 

client.connect().then(()=>{

app.listen(PORT, ()=>{
    console.log(`listening on PORT ${PORT}`);
})

})
////////////////////////////////////////

// // check

// app.get('/',homeHandler);

// function homeHandler(req,res){

// res.status(200).send('it works');

// }
// ////////////////////


// route definition


app.get('/',homeHandler);

app.get('/search',searchHandler);

app.post('/addToDb',addToDbHandler);


app.get('/selectData',selectDataHandler);

app.get('/details/:movie_id',detailsHandler);

app.put('/update/:update_id',updateHandler);

app.delete('/delete/:delete_id',deleteHandler);


// route handlers 

function homeHandler(req,res){


res.render('index');

}

//////////////////////////////////////

function searchHandler(req,res){


let title=req.query.title;

let type=req.query.radio;

let url=`https://api.themoviedb.org/3/search/${type}?api_key=${process.env.MOVIES_KEY}&query=${title}` ;

superagent.get(url).then(data=>{

    let moviesArray=data.body.results.map(val=>{

return new Movies (val) ;

    })

    res.render('pages/result',{data: moviesArray});
})

}
////////////////////////////////////////////////


// constructor function 

function Movies(val){

this.name=val.title || 'no title';
this.country=val.original_language || 'no country';
this.image=`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${val.poster_path}` || 'https://via.placeholder.com/450';
this.overview=val.overview || 'no overview';


}
////////////////////////////////////

function addToDbHandler(req,res){

let { name,country,image,overview}= req.body;
let sql=`INSERT INTO moviestable ( name,country,image,overview ) VALUES ($1,$2,$3,$4) ;`;
let safeValues=[name,country,image,overview  ];

client.query(sql,safeValues).then(()=>{

res.redirect('/selectData');

})

}

//////////////////////////////////////////////

 function  selectDataHandler(req,res){

let sql=`SELECT * FROM moviestable ;`;

client.query(sql).then(result=>{

    res.render('pages/favorite',{data:result.rows});
    
    })

 }

 //////////////////////////////////////////////

  function detailsHandler(req,res){

let param=req.params.movie_id;

let sql=`SELECT * FROM moviestable WHERE id=$1 ;` ;

let safeValues=[param];


client.query(sql,safeValues).then(result=>{

    res.render('pages/details',{data:result.rows[0]});
    
    })

  }


///////////////////////////////////////////////////


function updateHandler (req,res){

    let param=req.params.update_id;

    let { name,country,image,overview}= req.body;


    let sql=`UPDATE moviestable SET name=$1,country=$2,image=$3,overview=$4 WHERE id=$5 ;`;

let safeValues=[ name,country,image,overview,param ];


client.query(sql,safeValues).then(()=>{

    res.redirect(`/details/${param}`);
    
    })

}

///////////////////////////////////////


function deleteHandler (req,res){

    let param=req.params.delete_id;



    let sql=`DELETE FROM moviestable WHERE id=$1 ;`;

let safeValues=[param ];


client.query(sql,safeValues).then(()=>{

    res.redirect('/selectData');
    
    })

}

/////////////////////////////////////////////










////////////////////////////////

//////////////////////////////// 
// /// error handler 
// function errorHandler(err,req,res){
//     res.status(500).send(err);

// }

// /// not found handler

// function notFoundHandler(req,res){
//     res.status(404).send('page not found ');

// }