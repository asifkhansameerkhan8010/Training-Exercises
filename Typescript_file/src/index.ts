const displayField = document.getElementById("display") as HTMLInputElement;
const error=document.getElementById("errmsg") as HTMLParagraphElement;
function displayvalue(num: number | string): void {
    displayField.value += num.toString();
}
  
    function clearscreen(): void {
        displayField.value = '';
    }


    function calculate(): void {
        if(displayField.value=="")
        { 
            error.style.display="block";
        }
        else{
            error.style.display="none";
            try {
                if(eval(displayField.value)=="Infinity"){
                    displayField.value = "We cannot divide zero";
                }
                else{
                    displayField.value = eval(displayField.value).toFixed(5);
                }
                
            } catch (error) {
                displayField.value = "Error";
            }
        }
       
    }