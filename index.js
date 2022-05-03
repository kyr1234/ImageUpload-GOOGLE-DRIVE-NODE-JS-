 const GOOGLE_API_FOLDER_ID = '11sBL2sL1bmcDZ_fkzRnKhc_03t30EU6X'
const fs = require('fs')
const { google } = require('googleapis') 
const multer = require('multer')
const path = require('path')
 let value; 
let express = require('express')
const app = express()
const cors = require('cors')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  }),
)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './Images')
  },
  filename: (req, file, cb) => {
    value=Date.now()+path.extname(file.originalname) 
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('deployed')
})

app.post('/upload', upload.single('image'),uploadFile(value) ,(req, res) => {
  res.send('UPLOADED SUCCESS')
})

app.get('/', (req, res) => {
  res.send('Data Added Sdsfuccessfully')
})

const uploadFile=async(req,res,file,next) =>{
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './google.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': 'snowplace.jpg',
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(`./Images/${file}`)
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
    req.photoid= response.data.id
next()
    }catch(err){
        console.log('Upload file error', err)
    }
} 

/* 
uploadFile(value).then(data => {
    console.log(data)
    //https://drive.google.com/uc?export=view&id=1Lf7ASG6D2wyuzSdgEhZf4epjvaPwn-R9
}) */
