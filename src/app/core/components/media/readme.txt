Media 

  File object in DB will be the source of truth 
  File obj can be 
    Local blobURL (converted from local storage)
    URL of centralised
    URL of Arweave

  File uploader will upload to local db 
  Only move to server on publish 
  Risk of changing computer /brwser or clearning cache. 

  seperate files table 

File object 
  fid, 
  guid, //url 
  post_author, 
  post_date,
  post_mime_type,
  post_name, // file name  The-Girls-pose-in-the-park.jpg
  post_status, // deleted or 
  post_title, //file title The-Girls-pose-in-the-park
  post_type, //image, files, docs etc
  storage_type,
  file_size, 
  image: {
    alt
    h
    w
  }.
  thumbs {
    [size]:fid
  },
  file_obj: Orginal file obj,
  file_stage: //blob/server/blockchain
  blob_url: temp url, because this keep chaning 


BTCrev
  2.5Mn
  burn every day of double the amount of btc left
  1M into liq
  half M kept for burining
  half left for buying
  2.5 for founders and marketing 
