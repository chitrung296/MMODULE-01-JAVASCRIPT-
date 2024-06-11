document.addEventListener('DOMContentLoaded', () => {
    const employeeForm = document.getElementById('employee-form');
    const employeeTable = document.getElementById('employee-table').querySelector('tbody');
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    function validForm(employee, employees) {
        const { id, name, email } = employee;
    
        if (!id) {
            alert('Không được để trống Mã nhân viên!');
            return false;
        }
        if (!name) {
            alert('Không được để trống Tên nhân viên!');
            return false;
        }
        if (!email) {
            alert('Không được để trống Email nhân viên!');
            return false;
        }
    
        if (employees.some(emp => emp.id === id)) {
            alert('Mã nhân viên không được trùng nhau!');
            return false;
        }
        if (employees.some(emp => emp.email === email)) {
            alert('Email nhân viên không được trùng nhau!');
            return false;
        }
    
        return true;
    }
    

    function renderEmployees() {
        let text = "";
        for (let index = 0; index < employees.length; index++) {
            const employee = employees[index];
            text += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td class="actions">
                        <button class="edit" data-id="${employee.id}">Edit</button>
                        <button class="delete" data-id="${employee.id}">Delete</button>
                    </td>
                </tr>
            `;
        }
        document.getElementById("employee-table").querySelector("tbody").innerHTML = text;
    }
    

    function resetForm() {
        employeeForm.reset();
        document.getElementById('form-title').innerText = 'Add Employee';
        document.getElementById('submit-button').innerText = 'Add Employee';
        employeeForm.removeEventListener('submit', UpdateEmployee);
        employeeForm.addEventListener('submit', AddEmployee);
    }

    function AddEmployee(event) {
        event.preventDefault();
        const employeeId = document.getElementById('employeeId').value.trim();
        const employeeName = document.getElementById('employeeName').value.trim();
        const employeeEmail = document.getElementById('employeeEmail').value.trim();
    
        const newEmployee = { id: employeeId, name: employeeName, email: employeeEmail };
    
        if (validForm(newEmployee, employees)) {
            employees.push(newEmployee);
            localStorage.setItem('employees', JSON.stringify(employees));
            renderEmployees();
            resetForm();
        } else {
            alert('Vui lòng điền đúng thông tin nhân viên.');
        }
    }
    

    function UpdateEmployee(employeeId) {
        return function (event) {
            event.preventDefault();
            const employeeName = document.getElementById('employeeName').value.trim();
            const employeeEmail = document.getElementById('employeeEmail').value.trim();

            const index = employees.findIndex(emp => emp.id === employeeId);
            if (index !== -1) {
                employees[index].name = employeeName;
                employees[index].email = employeeEmail;
                localStorage.setItem('employees', JSON.stringify(employees));
                renderEmployees();
                resetForm();
            }
        }
    }

    employeeTable.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('delete')) {
            const employeeId = target.getAttribute('data-id');
            if (confirm('Bạn có chắc chắn xóa nhân viên này không???')) {
                employees = employees.filter(emp => emp.id !== employeeId);
                localStorage.setItem('employees', JSON.stringify(employees));
                renderEmployees();
            }
        }

        if (target.classList.contains('edit')) {
            const employeeId = target.getAttribute('data-id');
            const employee = employees.find(emp => emp.id === employeeId);
            if (employee) {
                document.getElementById('employeeId').value = employee.id;
                document.getElementById('employeeName').value = employee.name;
                document.getElementById('employeeEmail').value = employee.email;
                document.getElementById('form-title').innerText = 'Update Employee';
                document.getElementById('submit-button').innerText = 'Update Employee';

                employeeForm.removeEventListener('submit', AddEmployee);
                employeeForm.addEventListener('submit', UpdateEmployee(employeeId));
            }
        }
    });

    employeeForm.addEventListener('submit', AddEmployee);

    renderEmployees();
});
