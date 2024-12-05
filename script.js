function updateSliderValue() {
  const slider = document.getElementById('dayUsagePercent');
  const value = slider.value;
  document.getElementById('sliderValue').innerText = `${value}%`;

  // Calculate night usage as the complement of day usage
  const nightUsage = 100 - value;
  document.getElementById('nightSliderValue').innerText = `${nightUsage}%`;
}

// Calculate the results based on input values
function calculate() {
  const monthlyBill = parseFloat(document.getElementById('monthlyBill').value); // Monthly electricity bill
  const electricityRate = parseFloat(document.getElementById('electricityRate').value); // Electricity rate
  const roofArea = parseFloat(document.getElementById('roofArea').value); // Roof area for panels
  const dayUsagePercent = parseFloat(document.getElementById('dayUsagePercent').value); // Day usage percentage
  const nightUsagePercent = 100 - dayUsagePercent; // Night usage percentage
  const phase = parseInt(document.getElementById('phase').value); // Phase (1 or 3)

  if (isNaN(monthlyBill) || isNaN(electricityRate) || isNaN(roofArea) || isNaN(dayUsagePercent)) {
    document.getElementById('result').innerHTML = "<p style='color:red;'>กรุณากรอกข้อมูลให้ครบถ้วน!</p>";
    return;
  }

  // Monthly usage in kWh based on the bill and rate
  const monthlyUsage = monthlyBill / electricityRate;
  console.log("monthlyUsage", monthlyUsage);

  const o_1 = monthlyUsage * electricityRate;

  const o_2 = o_1 * 12;
  localStorage.setItem('loco', o_2);

  // ตรวจสอบค่าใน localStorage
  // console.log(localStorage.getItem('loco'));
  // console.log(o_2,"dsad");

  // Daily usage calculation (assuming 30 days in a month)
  const dailyUsage = monthlyUsage / 30;


  // Day and night usage based on the percentage
  const dayUsage = dailyUsage * (dayUsagePercent / 100);
  const nightUsage = dailyUsage * (nightUsagePercent / 100);

  // Assumed solar production per panel (in kWh) and daily use in kWh
  const solarProductionPerPanel = 0.3; // kWh produced per panel per day (example)

  // Monthly usage of kWh and number of panels needed
  const kwMount = monthlyUsage / 150; // Approximate calculation for panel capacity
  const dailySolarProduction = kwMount * 1000; // Daily solar production in watt
  // console.log(dailySolarProduction);
  const kwMount_m = Math.ceil(monthlyUsage / 150); // Calculate the number of panels needed


  const panelsNeeded = Math.ceil(dailySolarProduction / 625); // Calculate the number of panels needed
  // console.log(panelsNeeded);
  console.log("panelsNeeded", panelsNeeded);

  const areaRequired = panelsNeeded * 2; // Area required for panels (2 m² per panel)
  // console.log(kwMount_m);
  console.log("roofArea", roofArea);


  // Check if the roof area is sufficient
  const bufferArea = 2; // เผื่อพื้นที่ 2 ตารางเมตร
  const adjustedAreaRequired = areaRequired + bufferArea;

 

  const additionalAreaNeeded = Math.max(0, adjustedAreaRequired - roofArea);
  const roofStatus_1 = roofArea >= adjustedAreaRequired
    ? `<span style="color:green;">เพียงพอ</span>`
    : `<span style="color:red;">ไม่เพียงพอ</span>`;
 const roofStatus = roofArea >= adjustedAreaRequired
    ? `<span></span>`
    : `<span class="fa-solid fa-exclamation-circle" style=" font-size:14px; color:red;"> คุณต้องมีพื้นที่หลังคามากว่าพื้นที่ติดตั้ง ทางเราแนะนำที่ ${adjustedAreaRequired.toFixed(2)} ตารางเมตรขึ้นไป</span>`;
  console.log(`สถานะพื้นที่หลังคา: ${roofStatus}`);
  console.log(`ต้องการพื้นที่เพิ่มเติม: ${additionalAreaNeeded.toFixed(2)} ตารางเมตร`);

  // Calculating savings (cost savings from solar offsetting day usage)
  const dailySavings = dayUsage * electricityRate; // Savings per day based on the day usage
  const monthlySavings = dailySavings * 30; // Savings per month (30 days in a month)
  const yearlySavings = monthlySavings * 12; // Savings per year
  const savingIn25Years = yearlySavings * 25;
  // Total power calculation for the required solar system
  const totalKW = dayUsage / solarProductionPerPanel;

  // Calculating current for phase 1 or 3
  const voltage = phase === 1 ? 218 : 380;
  const current = phase === 1
    ? (totalKW * 1000) / (voltage * 0.9) // Assumed power factor of 0.9
    : (totalKW * 1000) / (Math.sqrt(3) * voltage * 0.9);



  document.getElementById('result').innerHTML = `
    <div style="font-size: 14px; font-weight: bold;">
      <p><i class="fa-solid fa-check"></i> การใช้ไฟเฉลี่ยต่อเดือน: <b>${monthlyUsage.toFixed(2)} kWh</b></p>
      <p><i class="fa-solid fa-check"></i> การใช้ไฟเฉลี่ยต่อวัน: <b>${dailyUsage.toFixed(2)} kWh</b></p>
      <p><i class="fa-solid fa-check"></i> การใช้ไฟช่วงกลางวัน: <b>${dayUsage.toFixed(2)} kWh (${dayUsagePercent}%)</b></p>
      <p><i class="fa-solid fa-check"></i> การใช้ไฟช่วงกลางคืน: <b>${nightUsage.toFixed(2)} kWh (${nightUsagePercent}%)</b></p>
      <p><i class="fa-solid fa-check"></i> จำนวนแผงโซลาร์เซลล์ที่ต้องใช้: <b>${panelsNeeded} แผง</b></p>
      <p><i class="fa-solid fa-check"></i> พื้นที่ที่ต้องการติดตั้ง: <b>${areaRequired} ตร.ม.</b> (${roofStatus_1})</p>
      <p>${roofStatus}</p><br>
      <p><i class="fa-solid fa-check"></i> การประหยัดค่าไฟต่อวัน: <b>${dailySavings.toFixed(2)} บาท</b></p>
      <p><i class="fa-solid fa-check"></i> การประหยัดค่าไฟต่อเดือน: <b>${monthlySavings.toFixed(2)} บาท</b></p>
      <p><i class="fa-solid fa-check"></i> การประหยัดค่าไฟต่อปี: <b>${yearlySavings.toFixed(2)} บาท</b></p>
      <p><i class="fa-solid fa-check"></i> การประหยัดค่าไฟใน 25 ปี: <b>${savingIn25Years.toFixed(2)} บาท</b></p>

    </div>
  `;

  document.getElementById('result').style.display = "block";
}


function calculatepak() {
  const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
  const electricityRate = parseFloat(document.getElementById('electricityRate').value);
  const roofAreas = parseFloat(document.getElementById('roofArea').value); // Roof area for panel
  const isThreePhase = parseFloat(document.getElementById('phase').value);
  // const  = document.getElementById('phase').checked; // เช็คว่าเป็น 3 เฟส

  // คำนวณการใช้ไฟฟ้าเฉลี่ยต่อวัน (kWh)
  const monthlyUsageg = monthlyBill / electricityRate;
  const roofArea = roofAreas;
  const dailyUsage = monthlyUsageg / 30;
  const kwMountk = Math.ceil(monthlyUsageg / 150); // Approximate calculation for panel capacity
  const style = document.createElement('style');
  style.innerHTML = `
    .swal-title {
      font-size: 14px;
    }
    .swal-content {
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
  // ขนาดแผงที่แนะนำตามการใช้ไฟ
  let packageSuggestion = "";
  let packagePrices = 0;
  let paybackPeriods = 0;
  if (isThreePhase == 3) {
    // ถ้าเลือก 3 เฟส
    if (kwMountk <= 5 && roofArea <= 23) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 5 kW (3 เฟส)
            จำนวนแผง: 8 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 23.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-5KTL-M1
            ราคา: 181,000 บาท (รวม VAT)
        `;
      packagePrices = 181000;
    } else if (kwMountk <= 10 && roofArea <= 45) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 10 kW (3 เฟส)
            จำนวนแผง: 16 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 45.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-10KTL-M1
            ราคา: 262,000 บาท (รวม VAT)
        `; packagePrices = 262000;
    } else if (kwMountk <= 15 && roofArea <= 68) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 15 kW (3 เฟส)
            จำนวนแผง: 24 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 68.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-15KTL-M5
            ราคา: 380,000 บาท (รวม VAT)
        `; packagePrices = 380000;
    } else if (kwMountk <= 18 && roofArea <= 90) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 20 kW (3 เฟส)
            จำนวนแผง: 32 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 90.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-18KTL-M5
            ราคา: 470,000 บาท (รวม VAT)
        `; packagePrices = 470000;
    } else if (kwMountk <= 25 && roofArea <= 112) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 25 kW (3 เฟส)
            จำนวนแผง: 40 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 112.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-30KTL-M3
            ราคา: 630,000 บาท (รวม VAT)
        `; packagePrices = 630000;
    } else if (kwMountk <= 30 && roofArea <= 135) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 30 kW (3 เฟส)
            จำนวนแผง: 48 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 135.00 ตารางเมตร
            ราคา: 710,000 บาท (รวม VAT)
        `; packagePrices = 710000;
    } else if (kwMountk <= 35 && roofArea <= 157) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 35 kW (3 เฟส)
            จำนวนแผง: 56 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 157.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-36KTL-M3
            ราคา: 809,000 บาท (รวม VAT)
        `; packagePrices = 809000;
    } else if (kwMountk <= 40 && roofArea <= 179) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 40 kW (3 เฟส)
            จำนวนแผง: 64 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 179.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-40KTL-M3
            ราคา: 906,000 บาท (รวม VAT)
        `; packagePrices = 906000;
    } else {
      // ใช้ SweetAlert เมื่อเกิน 40 kW
      Swal.fire({
        title: "การประเมิน เกินกว่า 40 kW",
        html: `เรียนคุณลูกค้าติดต่อเจ้าหน้าที่ ต้องการสอบถามข้อมูลเพิ่มเติม \nกรณีที่ใช้ไฟเกินกว่า 40 kW โปรติดต่เจ้าหน้าที่ <br>ราคาอยู่ที่การประเมิน\n <br><br>สามารถติดต่อพนักงาน <br>ได้ที่ เบอร์ 
        <a href="tel:+66931371377" style="color: #3085d6; text-decoration: none;">093-1371377</a> กดเพื่อโทรออก`,
        icon: "warning",
        confirmButtonText: "ตกลง",
        customClass: {
          title: 'swal-title',  // ชื่อคลาสสำหรับ title
          content: 'swal-content'  // ชื่อคลาสสำหรับ content
        }
      });
      
      
    }
  } else {
    // ถ้าเป็น 1 เฟส
    if (kwMountk <= 1.8 && roofArea <= 9) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 1.8 kW (1 เฟส)
            จำนวนแผง: 3 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 9.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-3KTL-L1
            ราคา: 99,000 บาท (รวม VAT)
        `;
      packagePrices = 99000;

    } else if (kwMountk <= 3.1 && roofArea <= 14) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 3.1 kW (1 เฟส)
            จำนวนแผง: 5 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 14.00 ตารางเมตร
            ราคา: 128,000 บาท (รวม VAT)
        `;
      packagePrices = 128000;

    } else if (kwMountk <= 5 && roofArea <= 23) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 5 kW (1 เฟส)
            จำนวนแผง: 8 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 23.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN1800-5KTL-L1
            ราคา: 170,000 บาท (รวม VAT)
        `;
      packagePrices = 170000;

    } else if (kwMountk <= 10 && roofArea <= 45) {
      packageSuggestion = `
            แนะนำแพ็กเกจ 10 kW (1 เฟส)
            จำนวนแผง: 16 แผง
            ยี่ห้อ/รุ่น: Longi Hi-Mo7 / LR5-78HGD-625M
            พื้นที่ติดตั้ง: 45.00 ตารางเมตร
            อินเวอร์เตอร์ Huawei: SUN-1800-10KTL-LC0
            ราคา: 243,000 บาท (รวม VAT)
        `;
      packagePrices = 243000;

    }
  }
  let loco = localStorage.getItem('loco');
  console.log(loco);

  // Ensure the value is a number (if needed, you can parse it to a float or integer)
  loco = parseFloat(loco);
  // Math.ceil(monthlyUsage / 150);
  paybackPeriods = Math.ceil(packagePrices / loco);
  console.log("loco", loco);

  console.log("paybackPeriod", paybackPeriods);


  // แสดงผลแนะนำแพ็กเกจ
  if (dailyUsage <= 900) {
    document.getElementById('package_yare').innerHTML = `
        <p style="font-size: 24px; font-weight: bold;">
            <i class="fa-solid fa-money-bill-transfer"></i> 
            ระยะเวลาคืนทุน: ${paybackPeriods.toFixed(2)} ปี
        </p>
    `;
    document.getElementById('package_yare').style.display = "block";

    document.getElementById('packageDetails').innerHTML = `
  <p style="font-size: 14px;">${packageSuggestion}</p>
`;

    document.getElementById('packageDetails').style.display = "block";
  }
}
