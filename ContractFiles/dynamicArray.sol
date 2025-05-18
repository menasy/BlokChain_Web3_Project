// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Array
{
    uint length = 4;
    uint[] public dynamicArry = new uint[](length); // heap de boyle tanımlanır
    // Oncesinde değer atamadan da vectorler gibi push yapılabilir.

    // dynamicArry.push(7); ->  Solidity'de dizilere eleman ekleme (push) gibi işlemler sadece fonksiyonlar içinde yapılabilir.
    function setElement() public  returns(uint[] memory)
    {
        //Solidity'de view fonksiyonlar sadece veri okur, değiştirmez view kullanaayız eğer veri değiştireceksek

        dynamicArry.push(5); // sadece metod içinde kullanılabilir.
        for (uint i = 1; i<length; i++)
        {
            dynamicArry[i] = (10 * i);
        }
        return dynamicArry;
    }
   
    
}