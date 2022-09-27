import axios from "axios";



let channelId = null;
let playlistIdSet=[];
const APIKey = 'AIzaSyCA34YHKhuWEPIj0PzWlbKCmzsqVdd2GRQ';
const inputUrl = 'https://www.youtube.com/c/TaynguyenSoundOfficial' ;
const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3' ;

//Get channel name from URL by using Regex
let reChannelName = /^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/ ;
const match = reChannelName.exec(inputUrl);
const channelName = match[2].slice(2, match[2].length);
// console.log(channelName);

//get channelID
const paramGetChannelId = {
  part:'snippet',
  maxResults:'10',
  type:'channel',
}
const getChannelId = () => {
  axios.get(
    `${youtubeUrl}/search?part=${paramGetChannelId.part}&maxResults=${paramGetChannelId.maxResults}&q=${channelName}&type=${paramGetChannelId.type}&key=${APIKey}`)
    .then((res)=>{
      channelId=res.data.items[0].id.channelId;
      console.log("channelId",channelId);
    })
    .catch((err)=>{
      console.log("err",err);
    })
}

//get playlist arr

const paramGetPlaylistArr = {
  part:'snippet%2CcontentDetails',
  maxResults:'50',
}
const getPlaylistArr = () => {
  axios.get(
    // `${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=${channelId}&maxResults=${paramGetPlaylistArr.maxResults}&key=${APIKey}`)
    `${youtubeUrl}/playlists?part=${paramGetPlaylistArr.part}&channelId=UCFqyQS21T6gvnRcqIp5f_DA&maxResults=${paramGetPlaylistArr.maxResults}&key=${APIKey}`)
    .then((res)=>{
      // console.log("res",res.data.items.map((item)=>item.id));
      playlistIdSet.push(res.data.items.map((item)=>item.id));
      console.log("playlistIdSet",playlistIdSet);
    })
    .catch((err)=>{
      console.log("err",err);
    })
}

const currentPromise = new Promise((req,res)=>{
  getChannelId();
  if(channelId!=null){
    req(getPlaylistArr());
  }
})

currentPromise
  .then((data)=>{
    console.log(data);
  })
  .catch((err)=>{
    console.log(err);
  })
 

//-Save playlist url to arr with pagination

