function showtime () {

    const now = new Date();
    const time = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const date = now.toLocaleDateString("id-ID", {
       weekday: "long",
       day: "numeric",
       month: "long",
       year: "numeric" 
    });
    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = date;
}
showtime();
setInterval(showtime, 1000);