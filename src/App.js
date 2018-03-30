import React, { Component } from 'react';
import { Button } from 'antd';
import './App.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
const path = electron.remote.require('path');
const imageSize = electron.remote.require('image-size');

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            imagePath: undefined
        };
        this.showNativeDialog = this.showNativeDialog.bind(this);
    }
    render() {
        return (
            <div className="App">
                <Button type="primary" onClick={this.showNativeDialog}>选择图片</Button>
                {
                    this.renderImage()
                }
            </div>
        );
    }
    renderImage(){
        if(!this.state.imagePath){
            return;
        }
        return (
            <div>
                <img className="userIcon" src={this.state.imagePath}/>
                <p>图片宽度：{ this.state.imageSize.width }，图片高度：{ this.state.imageSize.height }</p>
            </div>
        );
    }
    showNativeDialog() {
        // 选择文件示例
        const dialog = electron.remote.dialog;
        dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {name: 'Images', extensions: 'png'},
            ]
        }, (filePaths)=>{
            if(!filePaths || filePaths.length === 0)
            {
                return;
            }
            let size = imageSize(filePaths[0]);
            this.setState({
                imagePath: path.join('file://', filePaths[0]),
                imageSize: {
                    width: size.width,
                    height: size.height,
                }
            });
        });

        // ipcRenderer.send('chooseFolder');
    }
}

export default App;