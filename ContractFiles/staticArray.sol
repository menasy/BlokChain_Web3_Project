// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Array
{
    uint[3] public staticArry = [uint(7),14,21];
    // Solidity, dizideki ilk elemanın tipini diğerleri için varsayılan kabul eder.
    //Eğer ilk eleman belirsizse (örneğin 1 yerine uint(1) yazmazsanız), derleyici hata verebilir.

    function staticArryExample() public view returns(int[3] memory, uint[3] memory) 
    {
        // memory dizileri fonksiyon çağrıları sırasında geçici olarak kullanılır.
        // storage dizileri blockchain'de kalıcıdır.
        int[3] memory  secondArry = [int(-5),-8,-12];
        return (secondArry, staticArry);
        // soldity de metodlar birden fazla değer dondurebillir.
    }

    // Dondurulen değerler dışarda alınmıyor mutlaka başka bir metod içinde alınması lazım.
    function    getValue() public view returns(int[3] memory, uint[3] memory)
    {
        (int[3] memory arry1, uint[3] memory arry2) = staticArryExample();
        return (arry1,arry2);
    } 

    
}