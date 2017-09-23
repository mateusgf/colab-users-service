var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  cpf: String,
  cnpj: String,
  phoneNumber: String
});

userSchema.methods.validateUniqueCpf = function() {

    if (this.cpf != '') {
        // validar
    }
  
    return true;
  };
  

var User = mongoose.model('User', userSchema);

module.exports = User;