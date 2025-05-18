// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract first{
    uint public number1 = 7;
    /*
    function sumNum() public pure  returns(uint)
    {
        uint num = 107;
        return (num + number1); // pure kullanılırsa metod dışardan hiçbir değer alamaz.
        
    }*/
    // View kullanılırsa dışardan veri okunabilir.
     function sumNum() public view  returns(uint)
    {
        uint num = 107;
        return (num + number1); // Hata vermez
        
    }
     function sumTakedNum(uint takedNum) public view  returns(uint)
    {
        // pure yazılırsa fonksiyon sadece kendi lokalindekilerle çalışır.
        // view yazarsa fonksiyon dışardan da parametre alabilir.
        // fonksiyon varsayılan olarak state değiştirebilen (state-modifying) bir fonksiyon olarak kabul edilir !!!!
        uint num = sumNum();
        return (num + takedNum); 
    }
    // Derledikten sonra parametreleri panelden kontrol lettiğimizde pure olanar mavi viewlar sarı olarak gozukur.
}