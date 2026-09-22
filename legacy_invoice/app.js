// Application State
let invoiceState = {
    businessName: '',
    businessAddress: '',
    businessContact: '',
    invoiceNumber: '',
    invoiceDate: '',
    customerTo: '',
    items: [],
    discount: 0,
    discountType: 'flat', // 'flat' or 'percent'
    taxRate: 0, // GST/Tax percent
    additionalCharges: 0
};

// Initial Sample Data
const sampleData = {
    businessName: 'DURVESH SLIDING WORK',
    businessAddress: 'At-Asroti, Post-Chowk, Tal-Khalapur, Dist-Raigad – 410206',
    businessContact: '9730168595 / 9561516411',
    invoiceNumber: 'DSW-2025-001',
    invoiceDate: '2025-09-11',
    customerTo: 'Venus Wire',
    items: [
        { description: 'Work Security Cabin ACP Sheet Repairing – New ACP Sheet 8×4', sqrt: 32, quantity: 1, rate: 300 },
        { description: 'Security Door – New 3×7', sqrt: 21, quantity: 1, rate: 450 },
        { description: 'Security Partition 3×7 – ACP Sheet Fix and New Glass', sqrt: 21, quantity: 1, rate: 450 }
    ],
    discount: 0,
    discountType: 'flat',
    taxRate: 0,
    additionalCharges: 0
};

// Helper: Format number to Indian Currency Format (₹ XX,XXX.XX)
function formatCurrency(amount) {
    if (isNaN(amount) || amount === null) amount = 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Helper: Format Date for display (DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// DOM Elements
const editorInputs = {
    businessName: document.getElementById('editor-business-name'),
    businessAddress: document.getElementById('editor-business-address'),
    businessContact: document.getElementById('editor-business-contact'),
    invoiceNumber: document.getElementById('editor-invoice-number'),
    invoiceDate: document.getElementById('editor-invoice-date'),
    customerTo: document.getElementById('editor-customer-to'),
    discount: document.getElementById('editor-discount'),
    discountType: document.getElementById('editor-discount-type'),
    taxRate: document.getElementById('editor-tax-rate'),
    additionalCharges: document.getElementById('editor-additional-charges')
};

const previewElements = {
    businessName: document.getElementById('preview-business-name'),
    businessNameFooter: document.getElementById('preview-business-name-footer'),
    businessAddress: document.getElementById('preview-business-address'),
    businessContact: document.getElementById('preview-business-contact'),
    invoiceNumber: document.getElementById('preview-invoice-number'),
    invoiceDate: document.getElementById('preview-invoice-date'),
    customerTo: document.getElementById('preview-customer-to'),
    subtotal: document.getElementById('preview-subtotal'),
    discountRow: document.getElementById('preview-discount-row'),
    discountValue: document.getElementById('preview-discount-value'),
    taxRow: document.getElementById('preview-tax-row'),
    taxValue: document.getElementById('preview-tax-value'),
    chargesRow: document.getElementById('preview-charges-row'),
    chargesValue: document.getElementById('preview-charges-value'),
    grandTotal: document.getElementById('preview-grand-total')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadSampleData();
});

// Setup Listeners for input change
function setupEventListeners() {
    // Bind simple metadata inputs
    const textBindings = [
        { input: editorInputs.businessName, preview: [previewElements.businessName, previewElements.businessNameFooter] },
        { input: editorInputs.businessAddress, preview: [previewElements.businessAddress] },
        { input: editorInputs.businessContact, preview: [previewElements.businessContact] },
        { input: editorInputs.invoiceNumber, preview: [previewElements.invoiceNumber] },
        { input: editorInputs.customerTo, preview: [previewElements.customerTo] }
    ];

    textBindings.forEach(binding => {
        binding.input.addEventListener('input', (e) => {
            const val = e.target.value;
            binding.preview.forEach(el => {
                if (el) el.innerText = val || '---';
            });
            // Update state
            const stateKey = binding.input.id.replace('editor-', '').replace(/-([a-z])/g, g => g[1].toUpperCase());
            invoiceState[stateKey] = val;
        });
    });

    // Special binding for Date (needs formatting)
    editorInputs.invoiceDate.addEventListener('input', (e) => {
        const val = e.target.value;
        invoiceState.invoiceDate = val;
        previewElements.invoiceDate.innerText = formatDate(val) || '---';
    });

    // Financial modifiers bindings
    const modifiers = [editorInputs.discount, editorInputs.discountType, editorInputs.taxRate, editorInputs.additionalCharges];
    modifiers.forEach(modifier => {
        modifier.addEventListener('input', () => {
            validateAndCalculate();
        });
    });

    // Buttons
    document.getElementById('btn-add-item').addEventListener('click', () => addItem());
    document.getElementById('btn-clear').addEventListener('click', () => clearInvoice());
    document.getElementById('btn-sample').addEventListener('click', () => loadSampleData());
    document.getElementById('btn-preview').addEventListener('click', () => scrollToPreview());
    document.getElementById('btn-download').addEventListener('click', () => downloadPDF());
    
    // Tab switching for mobile layout
    const tabEdit = document.getElementById('tab-edit');
    const tabPreview = document.getElementById('tab-preview');
    const panelEdit = document.getElementById('panel-edit');
    const panelPreview = document.getElementById('panel-preview');

    if (tabEdit && tabPreview) {
        tabEdit.addEventListener('click', () => {
            tabEdit.classList.add('border-blue-600', 'text-blue-600');
            tabEdit.classList.remove('border-transparent', 'text-gray-500');
            tabPreview.classList.remove('border-blue-600', 'text-blue-600');
            tabPreview.classList.add('border-transparent', 'text-gray-500');
            panelEdit.classList.remove('hidden');
            panelPreview.classList.add('hidden-mobile');
        });

        tabPreview.addEventListener('click', () => {
            tabPreview.classList.add('border-blue-600', 'text-blue-600');
            tabPreview.classList.remove('border-transparent', 'text-gray-500');
            tabEdit.classList.remove('border-blue-600', 'text-blue-600');
            tabEdit.classList.add('border-transparent', 'text-gray-500');
            panelEdit.classList.add('hidden');
            panelPreview.classList.remove('hidden-mobile');
        });
    }
}

// Load sample data into State & UI
function loadSampleData() {
    invoiceState = JSON.parse(JSON.stringify(sampleData));
    
    // Fill UI inputs
    editorInputs.businessName.value = invoiceState.businessName;
    editorInputs.businessAddress.value = invoiceState.businessAddress;
    editorInputs.businessContact.value = invoiceState.businessContact;
    editorInputs.invoiceNumber.value = invoiceState.invoiceNumber;
    editorInputs.invoiceDate.value = invoiceState.invoiceDate;
    editorInputs.customerTo.value = invoiceState.customerTo;
    
    editorInputs.discount.value = invoiceState.discount === 0 ? '' : invoiceState.discount;
    editorInputs.discountType.value = invoiceState.discountType;
    editorInputs.taxRate.value = invoiceState.taxRate === 0 ? '' : invoiceState.taxRate;
    editorInputs.additionalCharges.value = invoiceState.additionalCharges === 0 ? '' : invoiceState.additionalCharges;

    // Fill UI previews
    previewElements.businessName.innerText = invoiceState.businessName;
    previewElements.businessNameFooter.innerText = invoiceState.businessName;
    previewElements.businessAddress.innerText = invoiceState.businessAddress;
    previewElements.businessContact.innerText = invoiceState.businessContact;
    previewElements.invoiceNumber.innerText = invoiceState.invoiceNumber;
    previewElements.invoiceDate.innerText = formatDate(invoiceState.invoiceDate);
    previewElements.customerTo.innerText = invoiceState.customerTo;

    renderRows();
    validateAndCalculate();
}

// Clear all inputs and state
function clearInvoice() {
    if (!confirm('Are you sure you want to clear all invoice data?')) return;
    
    invoiceState = {
        businessName: '',
        businessAddress: '',
        businessContact: '',
        invoiceNumber: '',
        invoiceDate: '',
        customerTo: '',
        items: [],
        discount: 0,
        discountType: 'flat',
        taxRate: 0,
        additionalCharges: 0
    };

    // Reset inputs
    Object.keys(editorInputs).forEach(key => {
        if (key === 'discountType') {
            editorInputs[key].value = 'flat';
        } else {
            editorInputs[key].value = '';
        }
    });

    // Reset previews
    previewElements.businessName.innerText = '---';
    previewElements.businessNameFooter.innerText = '---';
    previewElements.businessAddress.innerText = '---';
    previewElements.businessContact.innerText = '---';
    previewElements.invoiceNumber.innerText = '---';
    previewElements.invoiceDate.innerText = '---';
    previewElements.customerTo.innerText = '---';

    // Clear validation borders
    Object.values(editorInputs).forEach(input => {
        input.classList.remove('border-red-500', 'bg-red-50');
    });

    renderRows();
    validateAndCalculate();
}

// Add blank row to items
function addItem() {
    invoiceState.items.push({
        description: '',
        sqrt: '',
        quantity: '',
        rate: ''
    });
    renderRows();
    validateAndCalculate();
    
    // Focus on description of the new row
    const rows = document.querySelectorAll('.editor-item-row');
    if (rows.length > 0) {
        const lastRowDesc = rows[rows.length - 1].querySelector('.item-description');
        if (lastRowDesc) lastRowDesc.focus();
    }
}

// Remove item by index
function removeItem(index) {
    invoiceState.items.splice(index, 1);
    renderRows();
    validateAndCalculate();
}

// Render dynamic rows in both Editor and Preview
function renderRows() {
    const editorContainer = document.getElementById('editor-items-container');
    const previewContainer = document.getElementById('preview-items-container');
    
    editorContainer.innerHTML = '';
    previewContainer.innerHTML = '';

    if (invoiceState.items.length === 0) {
        editorContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <i class="fa-regular fa-clipboard text-3xl mb-2 text-gray-400"></i>
                <p>No items added yet. Click "+ Add Item" to begin.</p>
            </div>
        `;
        previewContainer.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-400 italic">No items to display</td>
            </tr>
        `;
        return;
    }

    invoiceState.items.forEach((item, index) => {
        // --- 1. RENDER EDITOR ROW ---
        const editorRow = document.createElement('div');
        editorRow.className = 'editor-item-row bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-start md:items-center relative transition-all-300 hover:border-blue-300';
        editorRow.dataset.index = index;

        editorRow.innerHTML = `
            <div class="flex items-center gap-2 w-full md:w-auto">
                <span class="bg-blue-100 text-blue-700 font-semibold rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-inner">
                    ${index + 1}
                </span>
                <span class="md:hidden text-sm font-semibold text-gray-700">Item Details</span>
            </div>
            
            <div class="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-3">
                <div class="md:col-span-5">
                    <label class="md:hidden text-xs text-gray-500 mb-1 block">Description</label>
                    <input type="text" 
                        class="item-description w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all-300 text-sm" 
                        placeholder="e.g. Work Security Cabin ACP Sheet Repairing" 
                        value="${item.description}">
                </div>
                <div class="grid grid-cols-3 gap-2 md:col-span-7">
                    <div>
                        <label class="md:hidden text-xs text-gray-500 mb-1 block">SQRT</label>
                        <input type="number" step="any" min="0"
                            class="item-sqrt w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all-300 text-sm text-right" 
                            placeholder="32" 
                            value="${item.sqrt}">
                    </div>
                    <div>
                        <label class="md:hidden text-xs text-gray-500 mb-1 block">Qty</label>
                        <input type="number" step="any" min="0"
                            class="item-qty w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all-300 text-sm text-right" 
                            placeholder="1" 
                            value="${item.quantity}">
                    </div>
                    <div>
                        <label class="md:hidden text-xs text-gray-500 mb-1 block">Rate (₹)</label>
                        <input type="number" step="any" min="0"
                            class="item-rate w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all-300 text-sm text-right" 
                            placeholder="300" 
                            value="${item.rate}">
                    </div>
                </div>
            </div>

            <div class="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0">
                <div class="text-right flex-1 md:flex-none">
                    <span class="md:hidden text-xs text-gray-500 block mb-1">Total</span>
                    <span class="item-total-display font-semibold text-gray-800 text-sm block min-w-[80px]">₹0.00</span>
                </div>
                <button type="button" class="btn-remove-row text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all-300" title="Delete Row">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        // Attach event listeners to this editor row
        const descInput = editorRow.querySelector('.item-description');
        const sqrtInput = editorRow.querySelector('.item-sqrt');
        const qtyInput = editorRow.querySelector('.item-qty');
        const rateInput = editorRow.querySelector('.item-rate');
        const removeBtn = editorRow.querySelector('.btn-remove-row');

        // Handle description edit
        descInput.addEventListener('input', (e) => {
            invoiceState.items[index].description = e.target.value;
            updatePreviewRowText(index, 'description', e.target.value);
        });

        // Handle numeric inputs
        [sqrtInput, qtyInput, rateInput].forEach(input => {
            input.addEventListener('input', () => {
                const val = input.value === '' ? '' : parseFloat(input.value);
                
                if (input.classList.contains('item-sqrt')) invoiceState.items[index].sqrt = val;
                if (input.classList.contains('item-qty')) invoiceState.items[index].quantity = val;
                if (input.classList.contains('item-rate')) invoiceState.items[index].rate = val;

                // Validate individual field
                validateField(input);
                
                // Recalculate row & summary
                const rowTotal = calculateRowTotal(invoiceState.items[index]);
                editorRow.querySelector('.item-total-display').innerText = formatCurrency(rowTotal);
                
                // Update preview
                updatePreviewRowValues(index, invoiceState.items[index], rowTotal);
                calculateSummary();
            });
        });

        removeBtn.addEventListener('click', () => removeItem(index));
        editorContainer.appendChild(editorRow);

        // --- 2. RENDER PREVIEW ROW ---
        const previewRow = document.createElement('tr');
        previewRow.className = 'border-b border-gray-200 page-break-avoid transition-all-300';
        previewRow.dataset.previewIndex = index;
        
        const rowTotal = calculateRowTotal(item);
        previewRow.innerHTML = `
            <td class="px-4 py-3 text-center text-sm font-medium text-gray-500">${index + 1}</td>
            <td class="px-4 py-3 text-sm text-gray-800 preview-row-description break-words max-w-[280px]">${item.description || '---'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 preview-row-sqrt">${item.sqrt || '0'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 preview-row-qty">${item.quantity || '0'}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 preview-row-rate">${formatCurrencyWithoutSymbol(item.rate)}</td>
            <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 preview-row-total">${formatCurrency(rowTotal)}</td>
        `;
        previewContainer.appendChild(previewRow);
        
        // Initial setup for the editor row total display
        editorRow.querySelector('.item-total-display').innerText = formatCurrency(rowTotal);
    });
}

// Helper: formats currency without currency symbol (for table Rate column to save space)
function formatCurrencyWithoutSymbol(amount) {
    if (isNaN(amount) || amount === null || amount === '') amount = 0;
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Calculate individual row total
function calculateRowTotal(item) {
    const sqrt = parseFloat(item.sqrt) || 0;
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    if (sqrt < 0 || qty < 0 || rate < 0) return 0;
    return sqrt * qty * rate;
}

// Update specific text cells in the preview table row dynamically to keep focus on input
function updatePreviewRowText(index, field, value) {
    const previewRow = document.querySelector(`[data-preview-index="${index}"]`);
    if (!previewRow) return;
    
    if (field === 'description') {
        const descCell = previewRow.querySelector('.preview-row-description');
        if (descCell) descCell.innerText = value || '---';
    }
}

// Update specific numerical cells in the preview table row dynamically
function updatePreviewRowValues(index, item, rowTotal) {
    const previewRow = document.querySelector(`[data-preview-index="${index}"]`);
    if (!previewRow) return;

    const sqrtCell = previewRow.querySelector('.preview-row-sqrt');
    const qtyCell = previewRow.querySelector('.preview-row-qty');
    const rateCell = previewRow.querySelector('.preview-row-rate');
    const totalCell = previewRow.querySelector('.preview-row-total');

    if (sqrtCell) sqrtCell.innerText = item.sqrt === '' ? '0' : item.sqrt;
    if (qtyCell) qtyCell.innerText = item.quantity === '' ? '0' : item.quantity;
    if (rateCell) rateCell.innerText = formatCurrencyWithoutSymbol(item.rate);
    if (totalCell) totalCell.innerText = formatCurrency(rowTotal);
}

// Validation logic for individual fields
function validateField(input) {
    const val = parseFloat(input.value);
    if (input.value !== '' && (isNaN(val) || val < 0)) {
        input.classList.add('border-red-500', 'bg-red-50');
        return false;
    } else {
        input.classList.remove('border-red-500', 'bg-red-50');
        return true;
    }
}

// Perform calculations for all subtotal and totals, validation of all fields, and update summaries
function validateAndCalculate() {
    // 1. Read financial modifiers
    const discountVal = parseFloat(editorInputs.discount.value) || 0;
    const discountType = editorInputs.discountType.value;
    const taxRate = parseFloat(editorInputs.taxRate.value) || 0;
    const chargesVal = parseFloat(editorInputs.additionalCharges.value) || 0;

    // Validate modifiers
    validateField(editorInputs.discount);
    validateField(editorInputs.taxRate);
    validateField(editorInputs.additionalCharges);

    invoiceState.discount = discountVal;
    invoiceState.discountType = discountType;
    invoiceState.taxRate = taxRate;
    invoiceState.additionalCharges = chargesVal;

    calculateSummary();
}

// Recalculates final invoice aggregates and updates UI
function calculateSummary() {
    let subtotal = 0;
    
    // Sum item totals
    invoiceState.items.forEach(item => {
        subtotal += calculateRowTotal(item);
    });

    // Discount
    let discountAmount = 0;
    if (invoiceState.discount > 0) {
        if (invoiceState.discountType === 'percent') {
            discountAmount = subtotal * (invoiceState.discount / 100);
        } else {
            discountAmount = invoiceState.discount;
        }
    }
    // Cap discount at subtotal to prevent negative numbers
    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    // Tax (applied after discount)
    const taxableAmount = subtotal - discountAmount;
    let taxAmount = 0;
    if (invoiceState.taxRate > 0) {
        taxAmount = taxableAmount * (invoiceState.taxRate / 100);
    }

    // Additional charges
    const additionalCharges = invoiceState.additionalCharges;

    // Grand Total
    const grandTotal = taxableAmount + taxAmount + additionalCharges;

    // Update previews
    previewElements.subtotal.innerText = formatCurrency(subtotal);

    // Toggle and show modifiers in preview if they are applied (non-zero)
    if (discountAmount > 0) {
        previewElements.discountRow.classList.remove('hidden');
        const typeLabel = invoiceState.discountType === 'percent' ? `Discount (${invoiceState.discount}%)` : 'Discount';
        document.getElementById('preview-discount-label').innerText = typeLabel;
        previewElements.discountValue.innerText = `- ${formatCurrency(discountAmount)}`;
    } else {
        previewElements.discountRow.classList.add('hidden');
    }

    if (taxAmount > 0) {
        previewElements.taxRow.classList.remove('hidden');
        document.getElementById('preview-tax-label').innerText = `GST/Tax (${invoiceState.taxRate}%)`;
        previewElements.taxValue.innerText = formatCurrency(taxAmount);
    } else {
        previewElements.taxRow.classList.add('hidden');
    }

    if (additionalCharges > 0) {
        previewElements.chargesRow.classList.remove('hidden');
        previewElements.chargesValue.innerText = formatCurrency(additionalCharges);
    } else {
        previewElements.chargesRow.classList.add('hidden');
    }

    // Setup visual blink on Grand Total update
    const previousGrandTotal = previewElements.grandTotal.innerText;
    const formattedGrandTotal = formatCurrency(grandTotal);
    
    if (previousGrandTotal !== formattedGrandTotal) {
        previewElements.grandTotal.innerText = formattedGrandTotal;
        previewElements.grandTotal.classList.remove('calc-update');
        void previewElements.grandTotal.offsetWidth; // Trigger reflow for animation restart
        previewElements.grandTotal.classList.add('calc-update');
    }
}

// Scroll to the invoice preview panel on small screens
function scrollToPreview() {
    const previewPanel = document.getElementById('panel-preview');
    if (previewPanel) {
        previewPanel.scrollIntoView({ behavior: 'smooth' });
        
        // If in mobile layout and tabs are visible, activate the preview tab
        const tabPreview = document.getElementById('tab-preview');
        const tabEdit = document.getElementById('tab-edit');
        const panelEdit = document.getElementById('panel-edit');
        
        if (tabPreview && window.getComputedStyle(tabPreview).display !== 'none') {
            tabPreview.classList.add('border-blue-600', 'text-blue-600');
            tabPreview.classList.remove('border-transparent', 'text-gray-500');
            tabEdit.classList.remove('border-blue-600', 'text-blue-600');
            tabEdit.classList.add('border-transparent', 'text-gray-500');
            panelEdit.classList.add('hidden');
            previewPanel.classList.remove('hidden-mobile');
        }
    }
}

// PDF Download Trigger
function downloadPDF() {
    const company = invoiceState.businessName || 'Business';
    const invNum = invoiceState.invoiceNumber || 'Draft';
    
    // Sanitize filenames
    const cleanCompany = company.trim().replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
    const cleanInvNum = invNum.trim().replace(/[^a-z0-9]/gi, '_').replace(/_{2,}/g, '_');
    const filename = `Invoice_${cleanCompany}_${cleanInvNum}.pdf`;

    const element = document.getElementById('invoice-preview-container');

    // Display temporary loading toast/alert
    const btn = document.getElementById('btn-download');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Generating PDF...`;
    btn.disabled = true;

    // Use html2pdf
    const opt = {
        margin: [10, 10, 10, 10], // Margin in mm (top, left, bottom, right)
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2.5, // High resolution scale
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { 
            mode: ['avoid-all', 'css'], 
            avoid: '.page-break-avoid' 
        }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error('PDF Generation Error:', err);
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert('Could not download PDF. Please try again.');
    });
}
