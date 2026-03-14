/*
ex: Hugo tem 18 anos, pesa 54 kg
tem 1.64 de altura e seu IMC é de 25.925925925924
Hugo nasceu em 2008
*/

const nome = 'Hugo';
const sobrenome = 'silva';
const idade = 18;
const peso = 54
const alturaEmM = 1.64;
let indiceMassaCorporal; // peso / (altura * altura)
let anoNascimento;

// 1. Fazendo os cálculos
indiceMassaCorporal = peso / (alturaEmM * alturaEmM);
anoNascimento = 2026 - idade

// +

// 2. Exibindo os resultados (usando template Strings com crase )
console.log(`${nome} ${sobrenome} tem ${idade} anos, pesa ${peso} kg`);
console.log(`tem ${alturaEmM} de altura e seu IMC é de ${indiceMassaCorporal}`);
console.log(`${nome} nasceu em ${anoNascimento} .`); 