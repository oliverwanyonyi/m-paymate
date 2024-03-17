import React, { useState } from 'react';
    import axios from 'axios';
const Budget = () => {
 
    
    
    
      const [budgetAmount, setBudgetAmount] = useState(0);
      const [categories, setCategories] = useState([{ name: '', limit: 0 }]);
    
      const handleBudgetAmountChange = (event) => {
        setBudgetAmount(parseFloat(event.target.value));
      };
    
      const handleCategoryChange = (index, field, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index][field] = value;
        setCategories(updatedCategories);
      };
    
      const addCategory = () => {
        setCategories([...categories, { name: '', limit: 0 }]);
      };
    
      const removeCategory = (index) => {
        const updatedCategories = [...categories];
        updatedCategories.splice(index, 1);
        setCategories(updatedCategories);
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Perform form validation here
    
        const budgetData = {
          budgetAmount,
          categories,
        };
    
        try {
          await axios.post('/api/budgets', budgetData);
          // Handle success, e.g., display a success message
        } catch (error) {
          console.error('Error submitting budget data:', error);
          // Handle error, e.g., display an error message
        }
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <label>
            Budget Amount:
            <input
              type="number"
              value={budgetAmount}
              onChange={handleBudgetAmountChange}
            />
          </label>
    
          <h3>Categories</h3>
          {categories.map((category, index) => (
            <div key={index}>
              <label>
                Category Name:
                <input
                  type="text"
                  value={category.name}
                  onChange={(event) =>
                    handleCategoryChange(index, 'name', event.target.value)
                  }
                />
              </label>
              <label>
                Spending Limit:
                <input
                  type="number"
                  value={category.limit}
                  onChange={(event) =>
                    handleCategoryChange(index, 'limit', parseFloat(event.target.value))
                  }
                />
              </label>
              <button type="button" onClick={() => removeCategory(index)}>
                Remove Category
              </button>
            </div>
          ))}
    
          <button type="button" onClick={addCategory}>
            Add Category
          </button>
    
          <button type="submit">Submit Budget</button>
        </form>
   
  )
}

export default Budget