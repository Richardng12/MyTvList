import * as React from 'react';
import { GoogleLogin } from 'react-google-login';

interface IProps{
    Callback: any,
}

export default class Login extends React.Component<IProps>{


   public responseGoogle = (response: any) => {
        this.props.Callback(response);
    }

    public render() {
        return (
            <GoogleLogin
                clientId="769019956087-vshqknribbq1mmqoj4c936r6a0623n1p.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
            /> 
        );
    }
}