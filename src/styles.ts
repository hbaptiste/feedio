/**
 * - create icon 
 * 
*/
import styled from "styled-components";

export const AppContainer = styled.div`
    @media screen and (min-width: 600px) {
        display: flex;
        background-color: #3179ba;
        height: 100%;
        minHeight: 700px;
        padding: 20px;
        width:100%;
        border: 1px solid red;
        align-items: center;
        justify-content: center;
    }
`

interface RowProps {
    direction?: string,
    height?: string,
    width?: string,
    justify?: string
}

export const Row = styled.div<RowProps>`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
`

export const StyledUserList = styled.div`
    background-color: white;
    height: auto;
    width: 100%;
`

export const StyledMessageBoard = styled.div`
    background-color: white;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow-y: scroll;
    & .header {
        position: fixed;
        padding-left: 30px;
        width: 100%;
        display: flex;
        height: 64px;
        align-items: center;
        flex: 1;
        z-index: 100;
        background: #f0f0f0;
        border: 1px solid #e5ddd5;
    }
   & .content-wrapper {
     background-color: #e5ddd5;
     overflow-y: auto;
     padding-top:  40px;
     padding-bottom: 50px;
     flex: 1;
   }
   & .msg-list {
    padding: 20px 7%;
    display: flex;
    flex-direction: column;
    & .to-me {
        background: #cfe9ba;
        align-self: flex-end
    }
   }
    & .currentChannel {
        font-weight: bold;
        font-size:var( --font-size-1)
    }

    & .messageForm {
        position: fixed;
        bottom: 0px;
        width: 100%;
        margin-top: auto;
        padding: 10px;
        background: #f0f0f0;
        border: 1px solid #e5ddd5;
    }
    & textarea {
        flex: 1;
        box-sizing: border-box;
        border: none;
        border-radius: 15px;
        background-color: white;
        padding: 5px 5px;
        vertical-align: baseline;
        font-family: Roboto;
        font-size: 14px
    }
    & .sendBtn {
        margin-left: 10px;
        margin-right: 10px;
        border: 1px solid light-grey
    }
    & .test, .addImgBtn {
        width: 25px;
        height: 25px;
        opacity : 0.6;
        bsorder: 1px solid red;
        margin-right: 10px;
    }

     & .test:hover, .addImgBtn:hover {
       opacity: 1;
       border-radius: 100px;
       background: white; 
    }
`


interface StyledUserItem {
    selected?: string
}

export const StyledUserItem = styled.li<StyledUserItem>`
    display flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    border-bottom: 1px solid #ededed; 
    background: ${ props => props.selected? "#f7f7f7":"white" };
    padding: 5px;
    & .user_message_status {
       _border: 1px solid red;
       margin-bottom: 5px;
    }
    & .user_message_time {
        flex: 1;
        opacity: 0.6;
        font-size: 14px;
    }
    & .user_count_msg {
        display: block;     
        font-size: 13px;
        color: block;
        opacity: 0.7;
        background-color: #3cdf7a;
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        border-radius: 50%;
        margin: auto;
    }
    & .user_pseudo {
        text-font: 12px;
        box-sizing: border-box;
        background: #BADA55;
        text-align: center;
        min-width: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        flex: 0 0 50px;
        text-align: center;
        line-height: 50px;
    }
    & .user_username { 
        margin: 0;
        text-overflow: ellipsis;
        font-weight: bold;
        overflow: hidden;
        flex-grow: 1;
        font-size: 14px;
    }
    & .user_message {
        margin: 0px;
        opacity: 0.6;
        text-overflow: ellipsis;
        oveflow: hidden;
        flex: 1
    }
`
export const StyledChannelItem = styled.li`
    display: flex;
    flex-direction: row;
    padding : 5px;
    border-bottom: 1px solid #ededed; 
    justify-content: space-between;
    align-items: stretch;
    cursor: pointer;
    & .channel_icon {
        text-font: 12px;
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        flex: 0 0 50px;
        text-align: center;
        line-height: 50px;
        background: orange;
    }
    & .channel_title {
        text-overflow: ellipsis;
        font-weight: bold;
        overflow: hidden;
        flex-grow: 1;
        font-size: 14px;
        margin-left: 5px;
        align-self: center;
    }
    & .channel_action {
        display: flex;
        justify-content: center;
        align-self: center;
        align-items: center;
        background: var(--main-gray);
        border-radius: 50%;
        & .new_channel_button {
            width: 25px;
            height: 25px;
            padding: 3px;
            cursor: pointer;
        }
    }
    
`

export const StyleMessageItem  = styled.div`
    border-radius: 8px;
    max-width: 500px;
    display: flex;
    padding: 8px;
    width: fit-content;
    background: white;
    margin-top: 8px;
    box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
    & .content {
        margin: 0px;
        padding: 5px;
    }
    & .time {
        opacity: 0.6;
        font-size: 12px;
        float: right;
    }
`

export const Column = styled.div`
display: flex;
flex-direction: column;
`

export const StyledHeaderZone = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 51px;
    background: #f7f7f7;
    & .userSeach {
        flex: 1;
        & input {
            width: 80%;
            padding: 8px 5px 8px 20px; 
            border-radius: 20px;
            background: white;
            border: none;
        }
        & input:focus {
            border: 1px solid red;
        }
    }
    & .addChannelButton {
        width: 25px;
        height: 25px;
        background: #ededed;
        border-radius : 50%;
        margin-right: 10px;
        padding: 3px;
        cursor: pointer;
    }
    & .addChannelButton:hover {
        background: #D3DEDC;
    }
`

export const StyledChannelZone = styled.div`
    display: flex;
    flex-direction: row;
    & .channelList {
        margin-top: 30px;
        list-style: none;
    }

`

// add animation back buttoon
export const StyledChatBoard = styled.div`
 width: 100%;
 & .msg-board {
    display: none
 }
&.channelSelected {
    & .msg-board {
        display: block
    }
    & .usr-list {
        display: none
    }
 }
`