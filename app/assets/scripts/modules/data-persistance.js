
var data =  {
		local: function(name, value){
			if(value === undefined){ //Get
				byteValue = air.EncryptedLocalStore.getItem(name);
				if (byteValue){
					return byteValue.readUTFBytes(byteValue.bytesAvailable);
				}
				else
					return null;
			}
			else { //Set
				air.EncryptedLocalStore.removeItem(name);
				if(value != null){
					var data = new air.ByteArray();
					data.writeUTFBytes(value);
					air.EncryptedLocalStore.setItem(name, data);
				}
				return value;
			}
		}
};