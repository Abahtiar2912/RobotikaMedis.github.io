#include <micro_ros_arduino.h>
#include <stdio.h>
#include <rcl/rcl.h>
#include <rcl/error_handling.h>
#include <rclc/rclc.h>
#include <rclc/executor.h>
#include <std_msgs/msg/bool.h>

// ============================================================
// 1. KONFIGURASI JARINGAN (DEFAULT)
// ============================================================
// Ubah bagian ini sesuai dengan Hotspot/WiFi yang digunakan
char ssid[] = "MASUKKAN_NAMA_WIFI"; 
char password[] = "MASUKKAN_PASSWORD"; 

// IP Address Laptop/Server (Cek menggunakan 'ip a' atau 'ipconfig')
char agent_ip[] = "192.168.X.X"; 

// Port standar komunikasi Micro-ROS (UDP)
size_t agent_port = 8888;

// ============================================================
// 2. DEFINISI PIN HARDWARE (GPIO)
// ============================================================
#define BUTTON_PIN 16  // Input: Push Button
#define BUZZER_PIN 25  // Output: Active Buzzer
#define LED_RED 23     // Output: Indikator Bahaya (Merah)
#define LED_GREEN 22   // Output: Indikator Aman (Hijau)

// ============================================================
// 3. VARIABEL GLOBAL ROS 2
// ============================================================
rcl_publisher_t publisher;
rcl_subscription_t subscriber;
std_msgs__msg__Bool msg_pub; // Pesan yang akan dikirim (Status Tombol)
std_msgs__msg__Bool msg_sub; // Pesan yang diterima (Perintah Lampu)
rclc_executor_t executor;
rclc_support_t support;
rcl_allocator_t allocator;
rcl_node_t node;

// ============================================================
// 4. FUNGSI CALLBACK (LOGIKA OUTPUT)
// ============================================================
// Fungsi ini dieksekusi otomatis saat ada data masuk ke topik '/led_command'
void subscription_callback(const void * msgin) {
  const std_msgs__msg__Bool * msg = (const std_msgs__msg__Bool *)msgin;
  
  if (msg->data == true) { 
    // === KONDISI DARURAT (ALARM NYALA) ===
    digitalWrite(LED_RED, HIGH);    // Merah ON
    digitalWrite(LED_GREEN, LOW);   // Hijau OFF
    digitalWrite(BUZZER_PIN, HIGH); // Suara ON
  } 
  else { 
    // === KONDISI AMAN (STANDBY) ===
    digitalWrite(LED_RED, LOW);     // Merah OFF
    digitalWrite(LED_GREEN, HIGH);  // Hijau ON
    digitalWrite(BUZZER_PIN, LOW);  // Suara OFF
  }
}

// ============================================================
// 5. SETUP SYSTEM (INISIALISASI)
// ============================================================
void setup() {
  Serial.begin(115200);
  
  // Konfigurasi Mode Pin
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Menggunakan Resistor Internal
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);

  // Inisialisasi Koneksi WiFi & Transport Micro-ROS
  set_microros_wifi_transports(ssid, password, agent_ip, agent_port);
  
  // Delay sebentar untuk memastikan WiFi stabil
  delay(2000); 

  // Inisialisasi Node dan Alokator Memori
  allocator = rcl_get_default_allocator();
  rclc_support_init(&support, 0, NULL, &allocator);
  rclc_node_init_default(&node, "nurse_call_node", "", &support);

  // Inisialisasi Publisher (Topik: /button_state)
  // Berfungsi mengirim status tombol ke Laptop
  rclc_publisher_init_default(
    &publisher, 
    &node, 
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Bool), 
    "button_state");

  // Inisialisasi Subscriber (Topik: /led_command)
  // Berfungsi menerima perintah dari Laptop
  rclc_subscription_init_default(
    &subscriber, 
    &node, 
    ROSIDL_GET_MSG_TYPE_SUPPORT(std_msgs, msg, Bool), 
    "led_command");

  // Inisialisasi Executor (Pengelola Tugas)
  rclc_executor_init(&executor, &support.context, 1, &allocator);
  rclc_executor_add_subscription(&executor, &subscriber, &msg_sub, &subscription_callback, ON_NEW_DATA);
}

// ============================================================
// 6. LOOP UTAMA (RUNTIME)
// ============================================================
void loop() {
  // A. Baca Status Tombol
  // Logika dibalik (!): Ditekan = LOW (0) menjadi TRUE (1)
  bool isPressed = !digitalRead(BUTTON_PIN);
  
  // B. Publikasikan Data ke Server
  msg_pub.data = isPressed;
  rcl_publish(&publisher, &msg_pub, NULL);
  
  // C. Cek Data Masuk & Jalankan Callback (Spin)
  // Fungsi ini mengecek apakah ada perintah baru dari laptop
  rclc_executor_spin_some(&executor, RCL_MS_TO_NS(100));
  
  delay(100); // Delay 100ms agar tidak membanjiri jaringan
}