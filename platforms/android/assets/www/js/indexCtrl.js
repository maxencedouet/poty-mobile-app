angular.module('app')
.controller('indexCtrl', function($scope, $interval) {

    document.addEventListener("deviceready", function(){
        navigator.splashscreen.hide();
    }, false);


    $scope.myColor = {
        _r: 255,
        _g: 255,
        _b: 255
    }

    $scope.coefficient = 1

    $scope.intensity = {
      value: 100,
      options: {
        floor: 1,
        ceil: 100,
        hideLimitLabels: true,
        hidePointerLabels: true,
        getSelectionBarColor: null,
        getTickColor: null,
        getPointerColor: null,
        onEnd: function() {
            launch()   
        }
      }
    };
    
    var period = 0
        var index = 0
        var interval = 200
        var mode = 0
        var variation = 0

    $scope.variation = {
      value: 0,
      options: {
        floor: 0,
        ceil: 100,
        hideLimitLabels: true,
        hidePointerLabels: true,
        onEnd: function(){
            launch()
        }
      }
    };

    $scope.speed = {
      value: 0,
      options: {
        floor: 1,
        ceil: 100,
        hideLimitLabels: true,
        hidePointerLabels: true,
        onEnd: function(){
            launch()
        }
      }
    };

    $scope.options = {
        inline: true,
        round: true,
        format: 'raw',
        lightness: false,
        alpha: false,
        hue: false,
        saturation: false
    };

$scope.eventApi = {
    onChange:  function(api, color, $event) {
        launch()
    },
    onBlur:    function(api, color, $event) {},
    onOpen:    function(api, color, $event) {},
    onClose:   function(api, color, $event) {},
    onClear:   function(api, color, $event) {},
    onReset:   function(api, color, $event) {},
    onDestroy: function(api, color) {},
};


    function format (input) {
        var calc = ('000' + Math.round(input)).substr(-3).toString()
        return calc
    }


    function launch() {
        var hsl = rgbToHsl($scope.myColor._r,$scope.myColor._g,$scope.myColor._b)
        console.log(hsl,  $scope.intensity )
        var color = "i" + format(hsl[0]*255) + format(hsl[1]*255) + format(hsl[2]*255 * $scope.intensity.value / 100) + format($scope.variation.value) + "f"
        console.log(color);
        if($scope.potyId) {
            ble.write($scope.potyId, 'FFE0', 'FFE1', stringToBytes(color), function(succ){
                // console.log(succ)
            }, function(err){
                console.log(err)
            });     
        }   
    }


$scope.reset = function() {
    $scope.myColor = {
        _r: 0,
        _g: 0,
        _b: 0
    }
    sendColor()
}

// 100A0386C16468FE84A150C4E8

    function scanning () {
        console.log('scanning')
        ble.startScan([], function(succ){
            console.log(succ)
            if(succ.name == 'POTY' && !$scope.connected) {
                $scope.$apply(function(){
                    $scope.connected = true
                })

                console.log('one nearby poty')

                var temp = succ.id
                
                function connectTry () {
                    console.log('try')
                    
                    ble.connect(temp, function(succ){
                        
                        console.log('connecté à poty')

                        $scope.$apply(function(){
                            $scope.potyId = temp
                            $scope.spinning = false
                        })
                        launch()

                        setCookie('potyId', temp,10000);
                    
                    }, function(err){

                        $scope.$apply(function(){
                            $scope.connected = false
                        })

                        console.log('error', temp)

                        connectTry()
                    })
                }

                connectTry()
            
            }
        }, function(err) {
            console.log(err)
        });  
    }


    $scope.connect = function() {
        // TEST

        ble.isEnabled(
            function() {
                console.log("Bluetooth is enabled");
                $scope.$apply(function(){
                  $scope.spinning = true  
                })
                if(getCookie('potyId')) {
                    console.log('poty found')
                    ble.isConnected(getCookie('potyId'), function(){
                        console.log('already connected to poty')
                        $scope.$apply(function(){
                            $scope.potyId = getCookie('potyId')
                            $scope.spinning = false
                        })
                        launch()
                    }, function(){
                        console.log('not connected to poty found')
                        scanning()
                    });
                } else {
                    scanning()
                }
            },
            function() {
                navigator.notification.alert('Connecte ton bluetooth !!')
                console.log("Bluetooth is *not* enabled");
            }
        );
    }


    $scope.disconnect = function() {
        $scope.spinning = true

        ble.disconnect($scope.potyId, function(succ){
            console.log('you are disconneced')
            $scope.$apply(function(){
                $scope.spinning = false
                $scope.potyId = false 
            })
        }, function(err){
            $scope.$apply(function(){
                $scope.spinning = false
            })
            $scope.spinning = false
            console.log(err)
        });
    }


    function stringToBytes(string) {
       var array = new Uint8Array(string.length);
       for (var i = 0, l = string.length; i < l; i++) {
           array[i] = string.charCodeAt(i);
        }
        return array.buffer;
    }

    // setCookie('userId',$rootScope.user._id,10000);
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})