window.addEventListener('DOMContentLoaded', function(){
    fetch('/fa/solutions/competencies/carbon-neutral/index.html') //【ロード元URL】
        .then(response => response.text()) .then(data => { 
            const parser = new DOMParser();
            const html = parser.parseFromString(data, "text/html");
            const boxs = html.querySelectorAll('#nav_use_case_list');//【ロード元ID】
            const file_area = document.getElementById('use_case_load');//【ロード先ID】
            for(var box of boxs) {file_area.appendChild(box);}
    }); 
});