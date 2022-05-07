var app = angular.module("app", ["firebase"]);
app.config(function() {
    var config = {
        apiKey: "AIzaSyDDx-jBYOpSVMxIu2UfbV3yqD0XyikZsvw",
        authDomain: "workspace-b1838.firebaseapp.com",
        databaseURL: "https://workspace-b1838-default-rtdb.firebaseio.com",
        storageBucket: "workspace-b1838.appspot.com"
    };
    // JavaScript

    firebase.initializeApp(config);
});
app.controller("MyCtrl", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref('/product');
        var list = $firebaseArray(ref);
        var ref2 = firebase.database().ref('/account')
        var list2 = $firebaseArray(ref2);
        var id = new URL(document.URL).searchParams.get('id');
        $scope.items = []
        list.$loaded()
            .then(function(x) {
                x.forEach((v) => {
                    if (id) {
                        $scope.item = x.filter((x) => x.$id === id)
                    }
                    $scope.items = x
                    $scope.begin = 0;
                    $scope.pageCount = Math.ceil($scope.items.length / 6);
                    $scope.first = () => {
                        $scope.begin = 0;
                    }
                    $scope.prev = () => {
                        if ($scope.begin > 0) {
                            $scope.begin -= 6;
                        }
                    }
                    $scope.next = () => {
                        if ($scope.begin < ($scope.pageCount - 1) * 6) {
                            $scope.begin += 6;
                        }
                    }
                    $scope.last = () => {
                        $scope.begin = ($scope.pageCount - 1) * 6;
                    }
                })
            })
            .catch(function(error) {
                console.log("Error:", error);
            });
        list2.$loaded()
            .then(function(x) {
                $scope.accountList = x;
            })
            .catch(function(error) {
                console.log("Error:", error);
            });
        $scope.cart = JSON.parse(localStorage.getItem("Cart") || '[]');
        $scope.total = localStorage.getItem("total");


        $scope.addCart = (sp) => {
            var index = $scope.cart.findIndex((item) => {
                return (item.sanpham.$id == sp.$id);
            });
            if (index < 0) {
                var newSP = {
                    sanpham: sp,
                    slBan: 1
                };
                $scope.cart.push(newSP);
            } else {
                $scope.cart[index].slBan++
            }
            $scope.total++;
            localStorage.setItem("total", JSON.stringify($scope.total));
            $scope.total = localStorage.getItem("total");
            localStorage.setItem("Cart", JSON.stringify($scope.cart));
            $scope.cart = JSON.parse(localStorage.getItem("Cart") || '[]');
        }

        $scope.increase = (sp) => {
            $scope.cart.forEach(x => {
                if (x.sanpham.$id === sp.sanpham.$id) {
                    x.slBan++;
                    $scope.total++;
                }
            })
            localStorage.setItem("total", JSON.stringify($scope.total));
            localStorage.setItem("Cart", JSON.stringify($scope.cart));
        }

        $scope.decrease = (sp) => {
            if (sp.slBan > 1) {
                $scope.cart.forEach(x => {
                    if (x.sanpham.$id === sp.sanpham.$id) {
                        x.slBan--;
                        $scope.total--;
                    }
                })
                localStorage.setItem("total", JSON.stringify($scope.total));
                localStorage.setItem("Cart", JSON.stringify($scope.cart));
            }
        }

        $scope.removeCart = (sp) => {
            $scope.cart = $scope.cart.filter(x => x.sanpham.$id !== sp.sanpham.$id)
            $scope.total -= sp.slBan
            localStorage.setItem("total", JSON.stringify($scope.total));
            localStorage.setItem("Cart", JSON.stringify($scope.cart));
        }

        $scope.subtotal = () => {
            var subtotal = 0;
            if ($scope.total != 0) {
                for (let i in $scope.cart) {
                    subtotal += $scope.cart[i].sanpham.price * $scope.cart[i].slBan;
                }
            }
            return subtotal;
        }

        $scope.addAccount = () => {
            var account = {};
            account.name = $scope.fullName;
            account.sdt = $scope.phone;
            account.email = $scope.email;
            account.password = $scope.password;
            list2.$add(account);
            alert("Ban da dang ki tai khoan thanh cong!!!");
            location.replace('/Bootstrap/Asm/sign-in.htmll');
        }

        $scope.users = sessionStorage.getItem("user");

        $scope.loginAccount = () => {
            for (let i in $scope.accountList) {
                if ($scope.phone == $scope.accountList[i].sdt) {
                    if ($scope.password == $scope.accountList[i].password) {
                        $scope.isLogin = true;
                        $scope.user = $scope.accountList[i]
                        if ($scope.RememberMe) {
                            sessionStorage.setItem("user", JSON.stringify($scope.user))
                        }
                        location.replace('/');
                        alert('đăng nhập thành công');
                        break;
                    } else {
                        alert('Sai mật khẩu')
                        break;
                    }
                } else {
                    alert('Sai tên đăng nhập')
                    break;
                }
            }
        }
    }
]);