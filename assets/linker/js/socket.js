(function (io) {
   var socket = io.connect();
   socket.on('connect', function socketConnected() {

      console.log(
         'Socket is now connected !'
      );
      socket.on('disconnect', function () {
         console.log("Socket is now Disconnected");

      });

   });
   window.socket = socket;

})(window.io);
String.prototype.capF = function () {
   return this.charAt(0).toUpperCase() + this.slice(1);
};
