use actix_files as actix_fs; // Alias for actix_files
use actix_web::{web, App, HttpResponse, HttpServer, Result, get, http}; // Include http here
use serde::Deserialize;

#[derive(Deserialize)]
struct AuthData {
    username: String,
    password: String,
}

async fn authenticate(auth_data: web::Form<AuthData>) -> Result<HttpResponse> {
    if auth_data.username == "meeranzia" && auth_data.password == "zsmsm" {
        Ok(HttpResponse::Found().append_header((http::header::LOCATION, "/graph.html")).finish())
    } else {
        Ok(HttpResponse::Unauthorized().finish())
    }
}

#[get("/data")]
async fn data() -> HttpResponse {
    match std::fs::read_to_string("readings.csv") {
        Ok(contents) => HttpResponse::Ok().content_type("text/csv").body(contents),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/energy_usage_data")]
async fn energy_usage_data() -> HttpResponse {
    match std::fs::read_to_string("energy_usage.csv") {
        Ok(contents) => HttpResponse::Ok().content_type("text/csv").body(contents),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/power_consumption_data")]
async fn power_consumption_data() -> HttpResponse {
    match std::fs::read_to_string("power_consumption.csv") {
        Ok(contents) => HttpResponse::Ok().content_type("text/csv").body(contents),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[get("/energy_transfer_data")]
async fn energy_transfer_data() -> HttpResponse {
    match std::fs::read_to_string("energy_transfer.csv") {
        Ok(contents) => HttpResponse::Ok().content_type("text/csv").body(contents),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/authenticate", web::post().to(authenticate))
            .service(energy_transfer_data)
            .service(power_consumption_data)
            .service(energy_usage_data)
            .service(data)
            .service(actix_fs::Files::new("/static", "static").show_files_listing())
            .service(actix_fs::Files::new("/", "./static").index_file("index.html"))
            .service(actix_fs::Files::new("/graph", "./static").index_file("graph.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
