import React, { useState, useEffect } from 'react';
import './stocks.css';

const Stocks = () => {
    const [stockResults, setStockResults] = useState([]);
  
    async function processData(fileContents) {
        const lines = fileContents.trim().split("\n");
        const arr = []; //create array
    
        lines.forEach((line) => {
            // LOAD LINE
            const [stockName, priceStr, quantityStr] = line.split(",");
            const price = parseFloat(priceStr);
            const quantity = parseInt(quantityStr, 10);
            if (!stockName || !price || !quantity) return; //error check
        
            // IF stockName NOT IN arr, add a new stockEntry!
            let stockEntry = arr.find(stock => stock.name === stockName); //get stock.name === stockName
            if (!stockEntry) {
                stockEntry = { name: stockName, totalValue: 0, totalQuantity: 0, averagePrice: 0 };
                arr.push(stockEntry);
            }
        
            // DO computations and update stockEntry (there are 3 stockEntries after done)
            const multipliedLine = price * quantity; //multiply
            stockEntry.totalValue += multipliedLine;
            stockEntry.totalQuantity += quantity;
            //update averagePrice to reflect new data
            stockEntry.averagePrice = stockEntry.totalValue / stockEntry.totalQuantity;
        });
    
        return arr;
      }
  
      // endpoint call, stores in stockResults
    useEffect(() => {
      fetch('/data.txt')
        .then(response => response.text())
        .then(processData)
        .then(setStockResults)
        .catch(console.error);
    }, []);
  
    return (
        <div className="table-container">
            <h1>Stock Average Prices</h1>
            <table>
                <thead>
                    <tr>
                        <th></th> {/* For the logo column */}
                        <th>Stock</th>
                        <th>Average Price</th>
                    </tr>
                </thead>
                <tbody>
                    {stockResults.map((stock, index) => (
                        <tr key={stock.name}>
                            <td><img src={`/logo${index + 1}.png`} alt={`${stock.name} logo`} style={{ width: '50px' }} /></td>
                            <td>{stock.name}</td>
                            <td>${stock.averagePrice.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Stocks;