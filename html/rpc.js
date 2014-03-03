/*
 * Copyright 2014 Masao Nishie. All Rights Reserved.
 */
function REST( serverAddr , port ,paramNonEncode){
	this.execute = function( moduleid , mode, params , listener ){

		var session = this.createXMLHttpRequest( );

		var path = moduleid.replace('./g', '/');
		var url = "http://" +  serverAddr + ":" + port + "/" ;
		url += path;

		var getUrl =url;

		var paramstr = null;
		for ( var key in params ) {
			if( paramstr == null )
				paramstr = "?";
			else
				paramstr += "&";

			paramstr += key + "=" + params[key] ;
		}
		if( paramstr != null )
			getUrl += paramstr;
		
		if(mode=="GET"){
			session.open( mode , getUrl , true ); 
		} else {
			session.open( mode , url, true ); 
		}


		session.onreadystatechange = function( msg ){

			//if( session.readyState == 4 && session.status == 200 ){
			if( session.readyState == 4){
				var response;
				var resultMsg;
				try{
					response = JSON.parse( session.responseText );
					resultMsg = response.results;
					if(resultMsg == null){
						resultMsg = response;
					}
					console.log(response);
				} catch(e){

				}
				var errorMsg = null;
				if( session.status > 207 )
					errorMsg =  "Warning : Error [code:" + session.status + "]";

				if ( typeof listener == 'function' ) 
					listener( resultMsg , errorMsg );

				session.abort();
			}
		}

		session.onerror = function( error ){
			if ( typeof listener == 'function' ) 
				listener( null , "XMLHttpRequest onerror :" + error.toString() );

			console.error( error );
			session.abort();
		}

		if(mode=="GET"){
			session.send();
		} else {
			//paramstr = paramstr.replace("?","")
			session.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
			console.log(session);
			
			if(paramNonEncode){
				if(params == null){
					params = {};
				}
				var paramStr = null;
				try{
					paramStr = JSON.stringify( params )
				}catch(e){
				}
				console.log(paramStr);
				session.send(paramStr);
			} else {
				console.log(EncodeHTMLForm(params));
				session.send(EncodeHTMLForm(params));
			}
		}

	}

	function EncodeHTMLForm( data )
	{
	    var params = [];

	    for( var name in data )
	    {
	        var value = data[ name ];
	        var param = encodeURIComponent( name ).replace( /%20/g, '+' )
	            + '=' + encodeURIComponent( value ).replace( /%20/g, '+' );

	        params.push( param );
	    }

	    return params.join( '&' );
	}

	this.createXMLHttpRequest = function( ) {
		try {
			var req = new XMLHttpRequest( );
			if ( req.overrideMimeType ) {
				req.overrideMimeType( 'text/xml' );
			}
			return req;
		} catch ( ex ) {
			try {
				return new ActiveXObject( 'Msxml2.XMLHTTP' );
			} catch ( ex ) {
				try {
					return new ActiveXObject( 'Microsoft.XMLHTTP' );
				} catch ( ex )  {
					throw 'createXMLHttpRequest failed.';
				}
			}
		}
	}
}
